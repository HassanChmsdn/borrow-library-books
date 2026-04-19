"use client";

import { useEffect, useDeferredValue, useState } from "react";
import { useRouter } from "next/navigation";

import {
  adminUserRecords,
  adminUsersRoleOptions,
} from "./mock-data";
import {
  createAdminUserAction,
  updateAdminUserRoleAction,
  updateAdminUserStatusAction,
} from "./actions";
import type {
  AdminUserFormValues,
  AdminUserProfileRecord,
  AdminUserRecord,
  AdminUsersRoleFilter,
} from "./types";

interface AdminUsersFeedbackState {
  message: string;
  tone: "danger" | "success";
}

export function useAdminUsersModuleState(
  inputRecords: ReadonlyArray<AdminUserRecord> = adminUserRecords,
) {
  const router = useRouter();
  const [records, setRecords] = useState(inputRecords);
  const [createFeedback, setCreateFeedback] =
    useState<AdminUsersFeedbackState | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [roleFilter, setRoleFilter] = useState<AdminUsersRoleFilter>("all");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setRecords(inputRecords);
  }, [inputRecords]);

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const filteredRecords = records.filter((record) => {
    const matchesFilter = roleFilter === "all" || record.role === roleFilter;
    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      record.fullName.toLowerCase().includes(normalizedSearchValue) ||
      record.email.toLowerCase().includes(normalizedSearchValue) ||
      record.borrowingSummaryLabel.toLowerCase().includes(normalizedSearchValue);

    return matchesFilter && matchesSearch;
  });

  function clearFilters() {
    setRoleFilter("all");
    setSearchValue("");
  }

  function dismissCreateFeedback() {
    setCreateFeedback(null);
  }

  async function submitCreateUser(values: AdminUserFormValues) {
    setIsCreatingUser(true);
    setCreateFeedback(null);

    const result = await createAdminUserAction(values);

    if (result.status === "error") {
      setCreateFeedback({
        message: result.message,
        tone: "danger",
      });
      setIsCreatingUser(false);
      return false;
    }

    const createdRecord = result.record;

    if (createdRecord) {
      setRecords((current) => {
        const nextRecords = current.filter(
          (record) => record.id !== createdRecord.id,
        );

        return [createdRecord, ...nextRecords];
      });
    }

    setCreateFeedback({
      message: result.message,
      tone: "success",
    });
    setIsCreateDialogOpen(false);
    setIsCreatingUser(false);
    router.refresh();
    return true;
  }

  return {
    clearFilters,
    createFeedback,
    dismissCreateFeedback,
    filteredRecords,
    hasActiveFilters: roleFilter !== "all" || searchValue.trim().length > 0,
    isCreateDialogOpen,
    isCreatingUser,
    recordsCount: records.length,
    roleFilter,
    roleOptions: adminUsersRoleOptions,
    searchValue,
    setCreateDialogOpen: setIsCreateDialogOpen,
    setRoleFilter,
    setSearchValue,
    submitCreateUser,
  };
}

export function useAdminUserProfileState(initialUser?: AdminUserProfileRecord) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [isMutating, setIsMutating] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  async function suspendUser() {
    if (!user) {
      return;
    }

    setIsMutating(true);
    const result = await updateAdminUserStatusAction({
      status: "suspended",
      userId: user.id,
    });

    if (result.status === "success") {
      setUser((currentUser) =>
        currentUser
          ? {
              ...currentUser,
              status: "suspended",
            }
          : currentUser,
      );
    }

    setLastActionMessage(result.message);
    setIsMutating(false);

    if (result.status === "success") {
      router.refresh();
    }
  }

  async function reactivateUser() {
    if (!user) {
      return;
    }

    setIsMutating(true);
    const result = await updateAdminUserStatusAction({
      status: "active",
      userId: user.id,
    });

    if (result.status === "success") {
      setUser((currentUser) =>
        currentUser
          ? {
              ...currentUser,
              status: "active",
            }
          : currentUser,
      );
    }

    setLastActionMessage(result.message);
    setIsMutating(false);

    if (result.status === "success") {
      router.refresh();
    }
  }

  async function changeRole(nextRole: AdminUserProfileRecord["role"]) {
    if (!user) {
      return;
    }

    if (nextRole === user.role) {
      return;
    }

    setIsMutating(true);
    const result = await updateAdminUserRoleAction({
      role: nextRole,
      userId: user.id,
    });

    if (result.status === "success") {
      setUser((currentUser) =>
        currentUser
          ? {
              ...currentUser,
              role: nextRole,
            }
          : currentUser,
      );
    }

    setLastActionMessage(result.message);
    setIsMutating(false);

    if (result.status === "success") {
      router.refresh();
    }
  }

  return {
    isMutating,
    lastActionMessage,
    changeRole,
    reactivateUser,
    suspendUser,
    user,
  };
}
