"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { adminCategoryRecords, createAdminCategoryId } from "./mock-data";
import { deleteAdminCategoryAction, saveAdminCategoryAction } from "./actions";
import type {
  AdminCategoryDialogState,
  AdminCategoryFormValues,
  AdminCategoryMutationResult,
  AdminCategoryRecord,
} from "./types";

interface UseAdminCategoriesModuleStateOptions {
  initialRecords?: ReadonlyArray<AdminCategoryRecord>;
  onCreateCategory?: (
    values: AdminCategoryFormValues,
  ) => Promise<AdminCategoryMutationResult>;
  onDeleteCategory?: (
    category: AdminCategoryRecord,
  ) => Promise<AdminCategoryMutationResult>;
  onUpdateCategory?: (
    category: AdminCategoryRecord,
    values: AdminCategoryFormValues,
  ) => Promise<AdminCategoryMutationResult>;
  searchQuery?: string;
}

export function useAdminCategoriesModuleState({
  initialRecords = adminCategoryRecords,
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
  searchQuery = "",
}: UseAdminCategoriesModuleStateOptions) {
  const router = useRouter();
  const [records, setRecords] =
    React.useState<ReadonlyArray<AdminCategoryRecord>>(initialRecords);
  const [searchValue, setSearchValue] = React.useState(searchQuery);
  const [dialogState, setDialogState] =
    React.useState<AdminCategoryDialogState | null>(null);
  const [feedback, setFeedback] =
    React.useState<AdminCategoryMutationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setRecords(initialRecords);
  }, [initialRecords]);

  React.useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const normalizedQuery = searchValue.trim().toLowerCase();
  const filteredRecords = normalizedQuery
    ? records.filter((record) => {
        const searchText = `${record.name} ${record.description}`.toLowerCase();
        return searchText.includes(normalizedQuery);
      })
    : records;

  async function submitCategory(values: AdminCategoryFormValues) {
    setIsSubmitting(true);

    try {
      const result =
        dialogState?.mode === "edit" && dialogState.record
          ? await (onUpdateCategory?.(dialogState.record, values) ??
              saveAdminCategoryAction({
                categoryId: dialogState.record.id,
                mode: "edit",
                values,
              }))
          : await (onCreateCategory?.(values) ??
              saveAdminCategoryAction({ mode: "create", values }));

      if (result) {
        setFeedback(result);

        if (result.status === "success") {
          setDialogState(null);
          router.refresh();
        }

        return;
      }

      setRecords((current) => {
        if (dialogState?.mode === "edit" && dialogState.record) {
          return current.map((record) =>
            record.id === dialogState.record?.id
              ? {
                  ...record,
                  ...values,
                }
              : record,
          );
        }

        return [
          {
            id: createAdminCategoryId(values.name),
            bookCount: 0,
            description: values.description,
            name: values.name,
          },
          ...current,
        ];
      });
      setDialogState(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteCategory(category: AdminCategoryRecord) {
    const result =
      (await onDeleteCategory?.(category)) ??
      (await deleteAdminCategoryAction(category.id));

    if (result) {
      setFeedback(result);

      if (result.status === "success") {
        router.refresh();
      }

      return;
    }

    setRecords((current) =>
      current.filter((record) => record.id !== category.id),
    );
  }

  return {
    deleteCategory,
    dialogState,
    feedback,
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
    searchValue,
    setSearchValue,
    submitCategory,
  };
}
