"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  approveAdminBorrowingAction,
  manageAdminBorrowingAction,
  markAdminBorrowingReturnedAction,
  rejectAdminBorrowingAction,
} from "./actions";

import {
  adminBorrowingsRecords,
  adminBorrowingsTabLabels,
} from "./mock-data";
import type {
  AdminBorrowingManageStatus,
  AdminBorrowingRecord,
  AdminBorrowingsModuleProps,
  AdminBorrowingsTab,
} from "./types";

interface AdminBorrowingsFeedbackState {
  message: string;
  tone: "danger" | "success";
}

export function useAdminBorrowingsModuleState() {
  return useManagedAdminBorrowingsState(adminBorrowingsRecords);
}

export function useManagedAdminBorrowingsState(
  inputRecords: AdminBorrowingsModuleProps["records"] = adminBorrowingsRecords,
) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<AdminBorrowingsFeedbackState | null>(
    null,
  );
  const [isManagingBorrowing, setIsManagingBorrowing] = useState(false);
  const [managedRecord, setManagedRecord] = useState<AdminBorrowingRecord | null>(
    null,
  );
  const [records, setRecords] = useState(inputRecords ?? adminBorrowingsRecords);

  useEffect(() => {
    setRecords(inputRecords ?? adminBorrowingsRecords);
  }, [inputRecords]);

  const state = useAdminBorrowingsState(records);

  async function handleMutation(
    record: AdminBorrowingRecord,
    mutation: () => Promise<{ message: string; status: "error" | "success" }>,
  ) {
    setFeedback(null);
    const result = await mutation();

    setFeedback({
      message: result.message,
      tone: result.status === "success" ? "success" : "danger",
    });

    if (result.status === "success") {
      router.refresh();
    }

    return result;
  }

  return {
    ...state,
    feedback,
    async approveBorrowing(record: AdminBorrowingRecord) {
      await handleMutation(record, () =>
        approveAdminBorrowingAction({ requestId: record.id }),
      );
    },
    async markReturned(record: AdminBorrowingRecord) {
      await handleMutation(record, () =>
        markAdminBorrowingReturnedAction({ requestId: record.id }),
      );
    },
    closeManagementDialog() {
      if (isManagingBorrowing) {
        return;
      }

      setManagedRecord(null);
    },
    isManagingBorrowing,
    manageBorrowing: async (values: {
      assignedCopyId: string;
      rejectionReason: string;
      status: AdminBorrowingManageStatus;
    }) => {
      if (!managedRecord) {
        return;
      }

      setIsManagingBorrowing(true);

      try {
        const result = await handleMutation(managedRecord, () =>
          manageAdminBorrowingAction({
            assignedCopyId: values.assignedCopyId || undefined,
            bookId: managedRecord.bookId,
            rejectionReason: values.rejectionReason || undefined,
            requestId: managedRecord.id,
            status: values.status,
          }),
        );

        if (result.status === "success") {
          setManagedRecord(null);
        }
      } finally {
        setIsManagingBorrowing(false);
      }
    },
    managedRecord,
    openManagementDialog(record: AdminBorrowingRecord) {
      setFeedback(null);
      setManagedRecord(record);
    },
    async rejectBorrowing(record: AdminBorrowingRecord) {
      await handleMutation(record, () =>
        rejectAdminBorrowingAction({ requestId: record.id }),
      );
    },
  };
}

export function useAdminBorrowingsState(
  records: AdminBorrowingsModuleProps["records"] = adminBorrowingsRecords,
) {
  const [activeTab, setActiveTab] = useState<AdminBorrowingsTab>("pending");
  const [searchValue, setSearchValue] = useState("");

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const sourceRecords = records ?? adminBorrowingsRecords;
  const recordsInActiveTab = sourceRecords.filter(
    (record) => record.tab === activeTab,
  );

  const visibleRecords = recordsInActiveTab.filter((record) => {
    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      record.bookTitle.toLowerCase().includes(normalizedSearchValue) ||
      record.bookAuthor.toLowerCase().includes(normalizedSearchValue) ||
      record.memberName.toLowerCase().includes(normalizedSearchValue) ||
      record.memberEmail.toLowerCase().includes(normalizedSearchValue) ||
      record.branch.toLowerCase().includes(normalizedSearchValue);

    return matchesSearch;
  });

  const tabs = (
    ["pending", "active", "overdue", "returned"] as const
  ).map((value) => ({
    count: sourceRecords.filter((record) => record.tab === value).length,
    label: adminBorrowingsTabLabels[value],
    value,
  }));

  return {
    activeTab,
    clearSearch() {
      setSearchValue("");
    },
    hasSearchValue: normalizedSearchValue.length > 0,
    records: visibleRecords,
    recordsInActiveTabCount: recordsInActiveTab.length,
    searchValue,
    setActiveTab,
    setSearchValue,
    tabs,
  };
}
