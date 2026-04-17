"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { AdminFilterSelect } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  adminUserFormDefaults,
  adminUserRoleFieldOptions,
  adminUserStatusFieldOptions,
} from "../mock-data";
import {
  adminUserFormSchema,
  type AdminUserFormFieldErrors,
  type AdminUserFormValues,
} from "../types";

interface UserFormDialogProps {
  initialValues?: AdminUserFormValues;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AdminUserFormValues) => Promise<boolean | void> | boolean | void;
  open: boolean;
  submissionError?: string | null;
}

const textareaClassName =
  "rounded-input border-input bg-card text-body text-foreground placeholder:text-placeholder focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring min-h-28 w-full border px-4 py-3 shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-200 focus-visible:ring-4";

function mapUserFormErrors(
  issues: typeof adminUserFormSchema.safeParse extends (...args: never[]) => infer TResult
    ? TResult extends { success: false; error: infer TError }
      ? TError extends { issues: Array<infer TIssue> }
        ? TIssue[]
        : never
      : never
    : never,
) {
  const nextErrors: AdminUserFormFieldErrors = {};

  for (const issue of issues) {
    const pathKey = issue.path[0];

    if (typeof pathKey === "string") {
      const fieldKey = pathKey as keyof AdminUserFormValues;

      if (!nextErrors[fieldKey]) {
        nextErrors[fieldKey] = issue.message;
      }
    }
  }

  return nextErrors;
}

function UserFormDialog({
  initialValues = adminUserFormDefaults,
  isSubmitting,
  onOpenChange,
  onSubmit,
  open,
  submissionError,
}: Readonly<UserFormDialogProps>) {
  const [mounted, setMounted] = React.useState(false);
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<AdminUserFormFieldErrors>({});

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
        className="rounded-card border-border-subtle bg-card flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden border shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={async (event) => {
            event.preventDefault();

            const result = adminUserFormSchema.safeParse(values);

            if (!result.success) {
              setErrors(mapUserFormErrors(result.error.issues));
              return;
            }

            setErrors({});
            await onSubmit(result.data);
          }}
        >
          <div className="border-b border-black/5 p-5 sm:p-6">
            <div className="space-y-1.5">
              <h2 className="text-title text-foreground font-semibold">
                Create account
              </h2>
              <p className="text-body-sm text-text-secondary max-w-[60ch]">
                Add a new mocked member or staff account for roster review and future Auth0-backed
                account management. This flow stays local for now but uses the same
                typed role contract the real create-user mutation can adopt later.
              </p>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 sm:p-6">
            {submissionError ? (
              <div
                className="rounded-card border border-danger/25 bg-danger/5 px-4 py-3"
                role="alert"
              >
                <p className="text-body-sm text-danger font-medium">
                  {submissionError}
                </p>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-label text-foreground font-medium">
                  Full name
                </span>
                <Input
                  value={values.fullName}
                  aria-invalid={errors.fullName ? true : undefined}
                  disabled={isSubmitting}
                  placeholder="Enter the user full name"
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                />
                {errors.fullName ? (
                  <span className="text-body-sm text-danger" role="alert">
                    {errors.fullName}
                  </span>
                ) : (
                  <span className="text-body-sm text-text-secondary">
                    Use the name that will appear in account-facing borrowing,
                    admin, and profile views.
                  </span>
                )}
              </label>

              <label className="grid gap-1.5">
                <span className="text-label text-foreground font-medium">
                  Email
                </span>
                <Input
                  type="email"
                  value={values.email}
                  aria-invalid={errors.email ? true : undefined}
                  disabled={isSubmitting}
                  placeholder="name@library.test"
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                />
                {errors.email ? (
                  <span className="text-body-sm text-danger" role="alert">
                    {errors.email}
                  </span>
                ) : (
                  <span className="text-body-sm text-text-secondary">
                    The mocked flow checks this email for duplicates before
                    creating a local roster entry.
                  </span>
                )}
              </label>

              <AdminFilterSelect
                label="Role"
                options={adminUserRoleFieldOptions}
                value={values.role}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    role: value,
                  }))
                }
              />

              <AdminFilterSelect
                label="Account status"
                options={adminUserStatusFieldOptions}
                value={values.accountStatus}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    accountStatus: value,
                  }))
                }
              />

              <label className="grid gap-1.5 sm:col-span-2">
                <span className="text-label text-foreground font-medium">
                  Temporary password
                </span>
                <Input
                  value={values.temporaryPassword}
                  aria-invalid={errors.temporaryPassword ? true : undefined}
                  disabled={isSubmitting}
                  placeholder="Optional mocked temporary password"
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      temporaryPassword: event.target.value,
                    }))
                  }
                />
                {errors.temporaryPassword ? (
                  <span className="text-body-sm text-danger" role="alert">
                    {errors.temporaryPassword}
                  </span>
                ) : (
                  <span className="text-body-sm text-text-secondary">
                    Optional. Keep this for mocked onboarding only until Auth0
                    owns invitation and password flows for each account type.
                  </span>
                )}
              </label>

              <label className="grid gap-1.5 sm:col-span-2">
                <span className="text-label text-foreground font-medium">
                  Onboarding note
                </span>
                <textarea
                  value={values.onboardingNote}
                  aria-invalid={errors.onboardingNote ? true : undefined}
                  className={cn(
                    textareaClassName,
                    errors.onboardingNote ? "border-danger" : undefined,
                  )}
                  disabled={isSubmitting}
                  placeholder="Optional staff note about this mock account or onboarding context."
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      onboardingNote: event.target.value,
                    }))
                  }
                />
                {errors.onboardingNote ? (
                  <span className="text-body-sm text-danger" role="alert">
                    {errors.onboardingNote}
                  </span>
                ) : (
                  <span className="text-body-sm text-text-secondary">
                    Optional. Use this to capture placeholder onboarding context
                    until real invites and staff notes are wired to persistent data.
                  </span>
                )}
              </label>
            </div>
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
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export { UserFormDialog, type UserFormDialogProps };