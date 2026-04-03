"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { AdminFilterSelect } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  adminInventoryConditionLabels,
  adminInventoryStatusLabels,
} from "../mock-data";
import { adminInventoryFormSchema } from "../types";

import type {
  AdminInventoryCondition,
  AdminInventoryFormFieldErrors,
  AdminInventoryFormMode,
  AdminInventoryFormValues,
  AdminInventoryStatus,
} from "../types";

interface InventoryFormProps {
  initialValues: AdminInventoryFormValues;
  mode: AdminInventoryFormMode;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AdminInventoryFormValues) => void;
  open: boolean;
}

function InventoryForm({
  initialValues,
  mode,
  onOpenChange,
  onSubmit,
  open,
}: Readonly<InventoryFormProps>) {
  const [mounted, setMounted] = React.useState(false);
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<AdminInventoryFormFieldErrors>({});

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setValues(initialValues);
    setErrors({});
  }, [initialValues, open]);

  React.useEffect(() => {
    if (!open || !mounted) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, onOpenChange, open]);

  const updateField = <T extends keyof AdminInventoryFormValues>(
    field: T,
    nextValue: AdminInventoryFormValues[T],
  ) => {
    setValues((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => {
      if (!(field in current)) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = adminInventoryFormSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: AdminInventoryFormFieldErrors = {};

      result.error.issues.forEach((issue) => {
        const [field] = issue.path;

        if (typeof field === "string" && !(field in nextErrors)) {
          nextErrors[field] = issue.message;
        }
      });

      setErrors(nextErrors);
      return;
    }

    onSubmit(result.data);
  };

  if (!mounted || !open) {
    return null;
  }

  const dialogTitle = mode === "create" ? "Add inventory copy" : "Edit inventory copy";
  const dialogDescription =
    mode === "create"
      ? "Create a new physical copy record with future-ready fields for search, filtering, and CRUD integration."
      : "Update copy metadata, shelf placement, and operational status without leaving the inventory workspace.";

  const fieldClassName =
    "grid gap-1.5 text-body-sm text-text-secondary";
  const helperClassName = "text-caption text-text-tertiary";
  const errorClassName = "text-caption text-danger";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/35 p-4 sm:items-center"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="rounded-card border-border-subtle bg-card flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden border shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-black/5 p-5 sm:p-6">
          <div className="space-y-1.5">
            <h2 className="text-title text-foreground font-semibold">
              {dialogTitle}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {dialogDescription}
            </p>
          </div>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={fieldClassName}>
                <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Copy code
                </span>
                <Input
                  value={values.copyCode}
                  aria-invalid={Boolean(errors.copyCode)}
                  onChange={(event) => updateField("copyCode", event.target.value)}
                  placeholder="DT-FIC-1984-04"
                />
                <span className={cn(helperClassName, errors.copyCode && "hidden")}>
                  Use a clear branch and shelf-safe identifier.
                </span>
                {errors.copyCode ? <span className={errorClassName}>{errors.copyCode}</span> : null}
              </label>

              <label className={fieldClassName}>
                <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Book title
                </span>
                <Input
                  value={values.bookTitle}
                  aria-invalid={Boolean(errors.bookTitle)}
                  onChange={(event) => updateField("bookTitle", event.target.value)}
                  placeholder="Enter the book title"
                />
                <span className={cn(helperClassName, errors.bookTitle && "hidden")}>
                  Later this can map to a real book record selector.
                </span>
                {errors.bookTitle ? <span className={errorClassName}>{errors.bookTitle}</span> : null}
              </label>

              <label className={fieldClassName}>
                <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Author
                </span>
                <Input
                  value={values.bookAuthor}
                  aria-invalid={Boolean(errors.bookAuthor)}
                  onChange={(event) => updateField("bookAuthor", event.target.value)}
                  placeholder="Enter the author name"
                />
                {errors.bookAuthor ? <span className={errorClassName}>{errors.bookAuthor}</span> : null}
              </label>

              <label className={fieldClassName}>
                <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Location
                </span>
                <Input
                  value={values.location}
                  aria-invalid={Boolean(errors.location)}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder="Downtown · Shelf F3"
                />
                <span className={cn(helperClassName, errors.location && "hidden")}>
                  Use the branch and shelf path staff will scan fastest.
                </span>
                {errors.location ? <span className={errorClassName}>{errors.location}</span> : null}
              </label>

              <div className={fieldClassName}>
                <AdminFilterSelect<AdminInventoryCondition>
                  label="Condition"
                  options={([
                    "new",
                    "good",
                    "fair",
                    "poor",
                  ] as const).map((condition) => ({
                    label: adminInventoryConditionLabels[condition],
                    value: condition,
                  }))}
                  value={values.condition}
                  onValueChange={(value) => updateField("condition", value)}
                />
                {errors.condition ? <span className={errorClassName}>{errors.condition}</span> : null}
              </div>

              <div className={fieldClassName}>
                <AdminFilterSelect<AdminInventoryStatus>
                  label="Status"
                  options={([
                    "available",
                    "borrowed",
                    "maintenance",
                  ] as const).map((status) => ({
                    label: adminInventoryStatusLabels[status],
                    value: status,
                  }))}
                  value={values.status}
                  onValueChange={(value) => updateField("status", value)}
                />
                <span className={cn(helperClassName, errors.status && "hidden")}>
                  Use maintenance for staff-held or repair-bound copies.
                </span>
                {errors.status ? <span className={errorClassName}>{errors.status}</span> : null}
              </div>
            </div>

            <label className={fieldClassName}>
              <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Location note
              </span>
              <textarea
                value={values.locationNote}
                aria-invalid={Boolean(errors.locationNote)}
                onChange={(event) => updateField("locationNote", event.target.value)}
                placeholder="Optional note for audits, displays, or special handling"
                className={cn(
                  "rounded-input border-input bg-card text-body text-foreground placeholder:text-placeholder focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring min-h-28 w-full resize-y border px-4 py-3 shadow-xs outline-none focus-visible:ring-4",
                  errors.locationNote
                    ? "border-destructive bg-danger-surface/40 focus-visible:ring-destructive/20"
                    : null,
                )}
              />
              <span className={cn(helperClassName, errors.locationNote && "hidden")}>
                Optional staff-only context for the next stock review.
              </span>
              {errors.locationNote ? (
                <span className={errorClassName}>{errors.locationNote}</span>
              ) : null}
            </label>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-black/5 p-5 sm:flex-row sm:justify-end sm:p-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Save copy" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export { InventoryForm, type InventoryFormProps };