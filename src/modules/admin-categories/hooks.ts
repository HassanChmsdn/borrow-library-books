"use client";

import * as React from "react";

import {
  adminCategoryRecords,
  createAdminCategoryId,
  getAdminCategoryMarkerTone,
} from "./mock-data";
import type {
  AdminCategoryDialogState,
  AdminCategoryFormValues,
  AdminCategoryRecord,
} from "./types";

interface UseAdminCategoriesModuleStateOptions {
  initialRecords?: ReadonlyArray<AdminCategoryRecord>;
  onCreateCategory?: (values: AdminCategoryFormValues) => void;
  onDeleteCategory?: (category: AdminCategoryRecord) => void;
  onUpdateCategory?: (
    category: AdminCategoryRecord,
    values: AdminCategoryFormValues,
  ) => void;
  searchQuery?: string;
}

function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

export function useAdminCategoriesModuleState({
  initialRecords = adminCategoryRecords,
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
  searchQuery = "",
}: UseAdminCategoriesModuleStateOptions) {
  const [records, setRecords] =
    React.useState<ReadonlyArray<AdminCategoryRecord>>(initialRecords);
  const [dialogState, setDialogState] =
    React.useState<AdminCategoryDialogState | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setRecords(initialRecords);
  }, [initialRecords]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredRecords = normalizedQuery
    ? records.filter((record) => {
        const searchText = `${record.name} ${record.description}`.toLowerCase();
        return searchText.includes(normalizedQuery);
      })
    : records;

  async function submitCategory(values: AdminCategoryFormValues) {
    setIsSubmitting(true);
    await sleep(250);

    setRecords((current) => {
      if (dialogState?.mode === "edit" && dialogState.record) {
        return current.map((record) =>
          record.id === dialogState.record?.id
            ? {
                ...record,
                ...values,
                markerTone: getAdminCategoryMarkerTone(values.iconKey),
              }
            : record,
        );
      }

      return [
        {
          id: createAdminCategoryId(values.name),
          name: values.name,
          description: values.description,
          iconKey: values.iconKey,
          markerTone: getAdminCategoryMarkerTone(values.iconKey),
          bookCount: 0,
        },
        ...current,
      ];
    });

    if (dialogState?.mode === "edit" && dialogState.record) {
      onUpdateCategory?.(dialogState.record, values);
    } else {
      onCreateCategory?.(values);
    }

    setIsSubmitting(false);
    setDialogState(null);
  }

  function deleteCategory(category: AdminCategoryRecord) {
    setRecords((current) =>
      current.filter((record) => record.id !== category.id),
    );
    onDeleteCategory?.(category);
  }

  return {
    dialogState,
    filteredRecords,
    hasNoResults: records.length > 0 && filteredRecords.length === 0,
    isEmpty: records.length === 0,
    isSubmitting,
    openCreateDialog() {
      setDialogState({ mode: "create" });
    },
    openEditDialog(category: AdminCategoryRecord) {
      setDialogState({ mode: "edit", record: category });
    },
    records,
    resetDialog() {
      setDialogState(null);
    },
    searchQuery,
    submitCategory,
    deleteCategory,
  };
}
