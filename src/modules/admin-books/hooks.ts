"use client";

import { useDeferredValue, useState } from "react";
import type { FormEvent } from "react";
import { z } from "zod";

import {
  adminBookCreateDefaults,
  adminBooksCatalog,
  adminBooksCategories,
} from "./mock-data";
import type {
  AdminBookDetailsRecord,
  AdminBookDurationPreset,
  AdminBookFormFieldErrors,
  AdminBookFormMode,
  AdminBookFormValues,
  AdminBooksCategory,
  AdminBooksModuleProps,
} from "./types";
import { adminBookFormSchema } from "./types";

export function useAdminBooksModuleState(
  records: AdminBooksModuleProps["records"] = adminBooksCatalog,
) {
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState<AdminBooksCategory>("All");

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const sourceRecords = records ?? adminBooksCatalog;
  const filteredBooks = sourceRecords.filter((book) => {
    const matchesCategory = category === "All" || book.category === category;
    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      book.title.toLowerCase().includes(normalizedSearchValue) ||
      book.author.toLowerCase().includes(normalizedSearchValue) ||
      book.shelfCode.toLowerCase().includes(normalizedSearchValue);

    return matchesCategory && matchesSearch;
  });

  return {
    allRecordsCount: sourceRecords.length,
    books: filteredBooks,
    categories: adminBooksCategories,
    searchValue,
    setSearchValue,
    category,
    setCategory,
    clearFilters() {
      setSearchValue("");
      setCategory("All");
    },
    hasActiveFilters: searchValue.length > 0 || category !== "All",
  };
}

interface SubmissionState {
  description: string;
  tone: "danger" | "success";
  title: string;
}

interface UseAdminBookDetailsFormStateProps {
  book?: AdminBookDetailsRecord;
  initialValues?: AdminBookFormValues;
  mode: AdminBookFormMode;
  onDeleteBook?: (book: AdminBookDetailsRecord) => void;
  onSaveBook?: (values: AdminBookFormValues) => void;
}

function mapValidationErrors(
  error: z.ZodError<AdminBookFormValues>,
): AdminBookFormFieldErrors {
  const nextErrors: AdminBookFormFieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".");

    if (!key || nextErrors[key]) {
      continue;
    }

    nextErrors[key] = issue.message;
  }

  return nextErrors;
}

function sanitizeCurrencyInput(value: string) {
  return value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
}

export function useAdminBookDetailsFormState({
  book,
  initialValues = adminBookCreateDefaults,
  mode,
  onDeleteBook,
  onSaveBook,
}: UseAdminBookDetailsFormStateProps) {
  const [errors, setErrors] = useState<AdminBookFormFieldErrors>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState | null>(
    null,
  );
  const [values, setValues] = useState<AdminBookFormValues>(initialValues);

  const clearFieldError = (field: string) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const setBasicInfoField = <Field extends keyof AdminBookFormValues["basicInfo"]>(
    field: Field,
    value: AdminBookFormValues["basicInfo"][Field],
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      basicInfo: {
        ...currentValues.basicInfo,
        [field]: value,
      },
    }));
    clearFieldError(`basicInfo.${String(field)}`);
  };

  const setCoverFileName = (fileName: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      cover: {
        fileName,
      },
    }));
    clearFieldError("cover.fileName");
  };

  const setFeeMode = (modeValue: AdminBookFormValues["feeSettings"]["mode"]) => {
    setValues((currentValues) => ({
      ...currentValues,
      feeSettings: {
        amount: modeValue === "free" ? "" : currentValues.feeSettings.amount,
        mode: modeValue,
      },
    }));
    clearFieldError("feeSettings.mode");
    clearFieldError("feeSettings.amount");
  };

  const setFeeAmount = (amount: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      feeSettings: {
        ...currentValues.feeSettings,
        amount: sanitizeCurrencyInput(amount),
      },
    }));
    clearFieldError("feeSettings.amount");
  };

  const toggleDuration = (days: AdminBookDurationPreset) => {
    setValues((currentValues) => {
      const exists = currentValues.durationSettings.presetDays.includes(days);
      const presetDays = exists
        ? currentValues.durationSettings.presetDays.filter(
            (value) => value !== days,
          )
        : ([...currentValues.durationSettings.presetDays, days].sort(
            (left, right) => left - right,
          ) as AdminBookDurationPreset[]);

      return {
        ...currentValues,
        durationSettings: {
          ...currentValues.durationSettings,
          presetDays,
        },
      };
    });
    clearFieldError("durationSettings.presetDays");
  };

  const setAllowCustomDuration = (value: boolean) => {
    setValues((currentValues) => ({
      ...currentValues,
      durationSettings: {
        ...currentValues.durationSettings,
        allowCustomDuration: value,
      },
    }));
  };

  const setMetadataField = <Field extends keyof AdminBookFormValues["metadata"]>(
    field: Field,
    value: AdminBookFormValues["metadata"][Field],
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      metadata: {
        ...currentValues.metadata,
        [field]: value,
      },
    }));
    clearFieldError(`metadata.${String(field)}`);
  };

  const setStatus = (status: AdminBookFormValues["status"]) => {
    setValues((currentValues) => ({
      ...currentValues,
      status,
    }));
    clearFieldError("status");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionState(null);

    const parsedValues = adminBookFormSchema.safeParse(values);

    if (!parsedValues.success) {
      setErrors(mapValidationErrors(parsedValues.error));
      setSubmissionState({
        description:
          "Review the highlighted fields before continuing. The form schema is local and ready to be replaced by live API validation later.",
        tone: "danger",
        title: "Validation required",
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    window.setTimeout(() => {
      onSaveBook?.(parsedValues.data);
      setSubmissionState({
        description:
          mode === "create"
            ? "A mock create request was recorded. No backend persistence has been wired yet."
            : "A mock update request was recorded. This page is ready for later API integration.",
        tone: "success",
        title:
          mode === "create" ? "Book draft created" : "Book draft updated",
      });
      setIsSubmitting(false);
    }, 550);
  };

  const handleDelete = () => {
    if (!book) {
      return;
    }

    setSubmissionState(null);
    setIsDeleting(true);

    window.setTimeout(() => {
      onDeleteBook?.(book);
      setSubmissionState({
        description:
          "This is a mock delete hook only. Keep the dialog wiring and replace the handler when the real admin API is available.",
        tone: "danger",
        title: `${book.title} queued for deletion`,
      });
      setIsDeleting(false);
    }, 450);
  };

  return {
    errors,
    fieldError(field: string) {
      return errors[field];
    },
    handleDelete,
    handleSubmit,
    isDeleting,
    isSubmitting,
    setAllowCustomDuration,
    setBasicInfoField,
    setCoverFileName,
    setFeeAmount,
    setFeeMode,
    setMetadataField,
    setStatus,
    submissionState,
    toggleDuration,
    values,
  };
}
