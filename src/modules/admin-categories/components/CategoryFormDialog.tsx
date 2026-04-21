"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { translateNode, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import {
  adminCategoryFormSchema,
  type AdminCategoryFormFieldErrors,
  type AdminCategoryFormMode,
  type AdminCategoryFormValues,
} from "../types";

const textareaClassName =
  "rounded-input border-input bg-card text-body text-foreground placeholder:text-placeholder focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring min-h-32 w-full border px-4 py-3 shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-200 focus-visible:ring-4";

interface CategoryFormDialogProps {
  initialValues: AdminCategoryFormValues;
  isSubmitting: boolean;
  mode: AdminCategoryFormMode;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AdminCategoryFormValues) => Promise<void> | void;
  open: boolean;
}

interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  helperText?: React.ReactNode;
  label: React.ReactNode;
}

function mapCategoryFormErrors(
  issues: typeof adminCategoryFormSchema.safeParse extends (
    ...args: never[]
  ) => infer TResult
    ? TResult extends { success: false; error: infer TError }
      ? TError extends { issues: Array<infer TIssue> }
        ? TIssue[]
        : never
      : never
    : never,
) {
  const nextErrors: AdminCategoryFormFieldErrors = {};

  for (const issue of issues) {
    const pathKey = issue.path[0];

    if (typeof pathKey === "string") {
      const fieldKey = pathKey as keyof AdminCategoryFormValues;

      if (!nextErrors[fieldKey]) {
        nextErrors[fieldKey] = issue.message;
      }
    }
  }

  return nextErrors;
}

function FormField({ children, error, helperText, label }: FormFieldProps) {
  const { translateText } = useI18n();

  return (
    <label className="grid gap-1.5">
      <span className="text-label text-foreground font-medium">
        {translateNode(label, translateText)}
      </span>
      {children}
      {error ? (
        <span className="text-body-sm text-danger" role="alert">
          {translateText(error)}
        </span>
      ) : helperText ? (
        <span className="text-body-sm text-text-secondary">
          {translateNode(helperText, translateText)}
        </span>
      ) : null}
    </label>
  );
}

function CategoryFormDialog({
  initialValues,
  isSubmitting,
  mode,
  onOpenChange,
  onSubmit,
  open,
}: CategoryFormDialogProps) {
  const { translateText } = useI18n();
  const [mounted, setMounted] = React.useState(false);
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<AdminCategoryFormFieldErrors>({});

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onOpenChange(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitting, mounted, onOpenChange, open]);

  if (!mounted || !open) {
    return null;
  }

  const title = mode === "create" ? "Add category" : "Edit category";
  const description =
    mode === "create"
      ? "Create a reusable category record for browse organization, admin filtering, and future CRUD-backed collection workflows."
      : "Update the category details while keeping the same admin card structure and typed data boundaries.";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/35 p-4 sm:items-center"
      onClick={() => {
        if (!isSubmitting) {
          onOpenChange(false);
        }
      }}
    >
      <div
        className="rounded-card border-border-subtle bg-card w-full max-w-2xl border shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <form
          className="grid gap-0"
          onSubmit={async (event) => {
            event.preventDefault();

            const result = adminCategoryFormSchema.safeParse(values);

            if (!result.success) {
              setErrors(mapCategoryFormErrors(result.error.issues));
              return;
            }

            setErrors({});
            await onSubmit(result.data);
          }}
        >
          <div className="grid gap-4 p-5 sm:p-6">
            <div className="space-y-1.5">
              <h2 className="text-title-sm text-foreground font-semibold">
                {translateText(title)}
              </h2>
              <p className="text-body-sm text-text-secondary max-w-[56ch]">
                {translateText(description)}
              </p>
            </div>

            <FormField
              label="Category name"
              helperText="Use a short, public-facing label that also works cleanly in browse filters and admin tables."
              error={errors.name}
            >
              <Input
                value={values.name}
                aria-invalid={errors.name ? true : undefined}
                disabled={isSubmitting}
                placeholder={translateText("Enter category name")}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField
              label="Short description"
              helperText="Optional. Add a short explanation for how this category is used across browse and admin management views."
              error={errors.description}
            >
              <textarea
                value={values.description}
                aria-invalid={errors.description ? true : undefined}
                className={cn(
                  textareaClassName,
                  errors.description ? "border-danger" : undefined,
                )}
                disabled={isSubmitting}
                placeholder={translateText(
                  "Describe how this category is used across the catalog and admin management flows.",
                )}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </FormField>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-black/5 p-5 sm:flex-row sm:justify-end sm:p-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "create"
                  ? translateText("Saving category...")
                  : translateText("Updating category...")
                : mode === "create"
                  ? translateText("Save category")
                  : translateText("Save changes")}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export { CategoryFormDialog, type CategoryFormDialogProps };
