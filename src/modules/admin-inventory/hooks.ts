"use client";

import { useDeferredValue, useState } from "react";
import { useRouter } from "next/navigation";

import {
  adminInventoryRecords,
  adminInventoryStatusOptions,
  createAdminInventoryFormValues,
} from "./mock-data";
import { saveAdminInventoryCopyAction } from "./actions";

import type {
  AdminInventoryActionHandlers,
  AdminInventoryMutationResult,
  AdminInventoryFormMode,
  AdminInventoryFormValues,
  AdminInventoryModuleProps,
  AdminInventoryRecord,
  AdminInventoryStatusFilter,
} from "./types";

export function useAdminInventoryModuleState(
  records: AdminInventoryModuleProps["records"] = adminInventoryRecords,
  actionHandlers: AdminInventoryActionHandlers = {},
) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AdminInventoryStatusFilter>("all");
  const [feedback, setFeedback] = useState<AdminInventoryMutationResult | null>(
    null,
  );
  const [formMode, setFormMode] = useState<AdminInventoryFormMode>("create");
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [isSubmittingCopy, setIsSubmittingCopy] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();
  const sourceRecords = records ?? adminInventoryRecords;

  const filteredRecords = sourceRecords.filter((record) => {
    const matchesStatus =
      statusFilter === "all" ? true : record.status === statusFilter;
    const matchesSearch =
      normalizedSearchValue.length === 0
        ? true
        : record.copyCode.toLowerCase().includes(normalizedSearchValue) ||
          record.bookTitle.toLowerCase().includes(normalizedSearchValue) ||
          record.bookAuthor.toLowerCase().includes(normalizedSearchValue);

    return matchesStatus && matchesSearch;
  });

  const editingRecord = editingRecordId
    ? sourceRecords.find((record) => record.id === editingRecordId)
    : undefined;

  const inventoryFormInitialValues =
    createAdminInventoryFormValues(editingRecord);

  function openCreateForm() {
    setFormMode("create");
    setEditingRecordId(null);
    setIsFormOpen(true);
  }

  function openEditForm(record: AdminInventoryRecord) {
    setFormMode("edit");
    setEditingRecordId(record.id);
    setIsFormOpen(true);
  }

  async function handleSaveCopy(values: AdminInventoryFormValues) {
    setIsSubmittingCopy(true);

    try {
      const result =
        (await actionHandlers.onSaveCopy?.(values, {
          mode: formMode,
          record: editingRecord,
        })) ??
        (await saveAdminInventoryCopyAction({
          copyId: formMode === "edit" ? editingRecord?.id : undefined,
          mode: formMode,
          values,
        }));

      setFeedback(result);

      if (result.status === "success") {
        setIsFormOpen(false);
        setEditingRecordId(null);
        router.refresh();
      }
    } finally {
      setIsSubmittingCopy(false);
    }
  }

  return {
    clearFilters() {
      setSearchValue("");
      setStatusFilter("all");
    },
    filteredRecords,
    feedback,
    formMode,
    hasActiveFilters:
      normalizedSearchValue.length > 0 || statusFilter !== "all",
    inventoryFormInitialValues,
    isFormOpen,
    isSubmittingCopy,
    openCreateForm,
    openEditForm,
    recordsCount: sourceRecords.length,
    saveCopy: handleSaveCopy,
    searchValue,
    setIsFormOpen,
    setSearchValue,
    setStatusFilter,
    statusFilter,
    statusOptions: adminInventoryStatusOptions,
  };
}
