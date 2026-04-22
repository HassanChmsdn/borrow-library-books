"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { AdminFilterSelect } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type {
  AdminBorrowingManageStatus,
  AdminBorrowingRecord,
} from "../types";

interface BorrowingManagementValues {
  assignedCopyId: string;
  rejectionReason: string;
  status: AdminBorrowingManageStatus;
}

interface BorrowingManagementDialogProps {
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BorrowingManagementValues) => void;
  open: boolean;
  pending?: boolean;
  record: AdminBorrowingRecord | null;
}

function getInitialValues(
  record: AdminBorrowingRecord | null,
): BorrowingManagementValues {
  return {
    assignedCopyId:
      record?.assignedCopyId ?? record?.assignableCopies?.[0]?.value ?? "",
    rejectionReason: "",
    status: record?.reviewStatusOptions?.[0]?.value ?? "pending",
  };
}

function BorrowingManagementDialog({
  onOpenChange,
  onSubmit,
  open,
  pending = false,
  record,
}: Readonly<BorrowingManagementDialogProps>) {
  const { translateText } = useI18n();
  const [mounted, setMounted] = React.useState(false);
  const [values, setValues] = React.useState<BorrowingManagementValues>(
    getInitialValues(record),
  );
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setValues(getInitialValues(record));
    setFormError(null);
  }, [open, record]);

  React.useEffect(() => {
    if (!mounted || !open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        onOpenChange(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, onOpenChange, open, pending]);

  if (!mounted || !open || !record) {
    return null;
  }

  const copyRequired =
    values.status === "pending" ||
    values.status === "active" ||
    values.status === "overdue";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (copyRequired && values.assignedCopyId.trim().length === 0) {
      setFormError("Select an assigned copy before saving this borrowing update.");
      return;
    }

    if (
      values.status === "cancelled" &&
      values.rejectionReason.trim().length === 0
    ) {
      setFormError("Add a short rejection note before cancelling this borrowing request.");
      return;
    }

    setFormError(null);
    onSubmit(values);
  };

  const fieldClassName = "grid gap-1.5 text-body-sm text-text-secondary";
  const helperClassName = "text-caption text-text-tertiary";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/35 p-4 sm:items-center"
      onClick={() => {
        if (!pending) {
          onOpenChange(false);
        }
      }}
    >
      <div
        className="rounded-card border-border-subtle bg-card flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden border shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-black/5 p-5 sm:p-6">
          <div className="space-y-1.5">
            <h2 className="text-title text-foreground font-semibold">
              {translateText("Manage borrowing request")}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {translateText(
                "Adjust the assigned copy and lifecycle status from one admin surface.",
              )}
            </p>
          </div>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 sm:p-6">
            <div className="grid gap-3 rounded-2xl border border-black/5 bg-black/2 p-4 sm:grid-cols-2">
              <div>
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  {translateText("Book")}
                </p>
                <p className="text-body-sm text-foreground font-medium">
                  {translateText(record.bookTitle)}
                </p>
              </div>
              <div>
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  {translateText("Member")}
                </p>
                <p className="text-body-sm text-foreground font-medium">
                  {translateText(record.memberName)}
                </p>
              </div>
              <div>
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  {translateText("Current assignment")}
                </p>
                <p className="text-body-sm text-foreground font-medium">
                  {record.assignedCopyCode ?? translateText("No copy assigned")}
                </p>
              </div>
              <div>
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  {translateText("Current status")}
                </p>
                <p className="text-body-sm text-foreground font-medium">
                  {translateText(record.borrowingStatusLabel)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className={fieldClassName}>
                <AdminFilterSelect<AdminBorrowingManageStatus>
                  label="Status"
                  onValueChange={(value) => {
                    setValues((current) => ({ ...current, status: value }));
                    setFormError(null);
                  }}
                  options={record.reviewStatusOptions ?? []}
                  value={values.status}
                />
                <span className={helperClassName}>
                  {translateText(
                    "Move the request through review, checkout, overdue follow-up, return, or cancellation from this dialog.",
                  )}
                </span>
              </div>

              <div className={fieldClassName}>
                <AdminFilterSelect
                  disabled={!copyRequired || (record.assignableCopies?.length ?? 0) === 0}
                  label="Assigned copy"
                  onValueChange={(value) => {
                    setValues((current) => ({ ...current, assignedCopyId: value }));
                    setFormError(null);
                  }}
                  options={
                    record.assignableCopies?.length
                      ? record.assignableCopies
                      : [{ label: "No copy assigned", value: "" }]
                  }
                  value={values.assignedCopyId}
                />
                <span className={helperClassName}>
                  {copyRequired
                    ? translateText(
                        "Choose which physical copy should stay attached while this request remains open or checked out.",
                      )
                    : translateText(
                        "Returned and cancelled requests release the assigned copy automatically.",
                      )}
                </span>
              </div>
            </div>

            {values.status === "cancelled" ? (
              <label className={fieldClassName}>
                <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  {translateText("Rejection note")}
                </span>
                <textarea
                  className={cn(
                    "rounded-input border-input bg-card text-body text-foreground focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring min-h-28 w-full resize-y border px-4 py-3 shadow-xs outline-none focus-visible:ring-4",
                  )}
                  onChange={(event) => {
                    setValues((current) => ({
                      ...current,
                      rejectionReason: event.target.value,
                    }));
                    setFormError(null);
                  }}
                  placeholder={translateText(
                    "Capture a short admin-facing reason for cancelling this request.",
                  )}
                  value={values.rejectionReason}
                />
                <span className={helperClassName}>
                  {translateText(
                    "This note is stored with the borrowing request so staff can understand why it was closed.",
                  )}
                </span>
              </label>
            ) : null}

            {formError ? (
              <p className="text-caption text-danger font-medium">
                {translateText(formError)}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-black/5 p-5 sm:flex-row sm:justify-end sm:p-6">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              {translateText("Cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? translateText("Saving...") : translateText("Save changes")}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export {
  BorrowingManagementDialog,
  type BorrowingManagementDialogProps,
};