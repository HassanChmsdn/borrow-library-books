"use client";

import { useDeferredValue, useState } from "react";

import {
  adminInventoryRecords,
  adminInventoryStatusOptions,
  createAdminInventoryFormValues,
} from "./mock-data";

import type {
  AdminInventoryActionHandlers,
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
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AdminInventoryStatusFilter>("all");
  const [formMode, setFormMode] = useState<AdminInventoryFormMode>("create");
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
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
          record.bookAuthor.toLowerCase().includes(normalizedSearchValue) ||
          record.location.toLowerCase().includes(normalizedSearchValue) ||
          record.locationNote?.toLowerCase().includes(normalizedSearchValue) ||
          false;

    return matchesStatus && matchesSearch;
  });

  const editingRecord = editingRecordId
    ? sourceRecords.find((record) => record.id === editingRecordId)
    : undefined;

  const inventoryFormInitialValues = createAdminInventoryFormValues(editingRecord);

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

  function handleSaveCopy(values: AdminInventoryFormValues) {
    actionHandlers.onSaveCopy?.(values, {
      mode: formMode,
      record: editingRecord,
    });
    setIsFormOpen(false);
  }

  return {
    clearFilters() {
      setSearchValue("");
      setStatusFilter("all");
    },
    filteredRecords,
    formMode,
    hasActiveFilters:
      normalizedSearchValue.length > 0 || statusFilter !== "all",
    inventoryFormInitialValues,
    isFormOpen,
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
