import Link from "next/link";

import {
  AdminDetailSection,
  AdminSectionCard,
  ConfirmActionDialog,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type {
  AdminBookDetailsRecord,
  AdminBookDurationOption,
  AdminBookDurationPreset,
  AdminBookFormFieldErrors,
  AdminBookFormMode,
  AdminBookFormValues,
} from "../types";
import { BookCoverUploader } from "./BookCoverUploader";
import { BookDurationSettings } from "./BookDurationSettings";
import { BookFeeSettings } from "./BookFeeSettings";
import { BookMetadataSection } from "./BookMetadataSection";

const textareaClassName =
  "rounded-input border-input bg-card text-body text-foreground placeholder:text-placeholder focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring min-h-36 w-full border px-4 py-3 shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-200 focus-visible:ring-4";

interface BookDetailsFormProps {
  book?: AdminBookDetailsRecord;
  cancelHref?: string;
  durationOptions: ReadonlyArray<AdminBookDurationOption>;
  errors: AdminBookFormFieldErrors;
  isDeleting: boolean;
  isSubmitting: boolean;
  mode: AdminBookFormMode;
  onAllowCustomDurationChange: (value: boolean) => void;
  onBasicInfoChange: <Field extends keyof AdminBookFormValues["basicInfo"]>(
    field: Field,
    value: AdminBookFormValues["basicInfo"][Field],
  ) => void;
  onCoverFileNameChange: (fileName: string) => void;
  onDelete: () => void;
  onFeeAmountChange: (amount: string) => void;
  onFeeModeChange: (mode: AdminBookFormValues["feeSettings"]["mode"]) => void;
  onMetadataChange: <Field extends keyof AdminBookFormValues["metadata"]>(
    field: Field,
    value: AdminBookFormValues["metadata"][Field],
  ) => void;
  onStatusChange: (status: AdminBookFormValues["status"]) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleDuration: (days: AdminBookDurationPreset) => void;
  submissionState: {
    description: string;
    title: string;
    tone: "danger" | "success";
  } | null;
  values: AdminBookFormValues;
}

interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  helperText?: React.ReactNode;
  label: React.ReactNode;
  required?: boolean;
}

function FormField({
  children,
  error,
  helperText,
  label,
  required = false,
}: FormFieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-label text-foreground font-medium">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {children}
      {error ? (
        <span className="text-body-sm text-danger" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span className="text-body-sm text-text-secondary">{helperText}</span>
      ) : null}
    </label>
  );
}

function BookDetailsForm({
  book,
  cancelHref = "/admin/books",
  durationOptions,
  errors,
  isDeleting,
  isSubmitting,
  mode,
  onAllowCustomDurationChange,
  onBasicInfoChange,
  onCoverFileNameChange,
  onDelete,
  onFeeAmountChange,
  onFeeModeChange,
  onMetadataChange,
  onStatusChange,
  onSubmit,
  onToggleDuration,
  submissionState,
  values,
}: BookDetailsFormProps) {
  return (
    <form
      className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]"
      onSubmit={onSubmit}
    >
      <div className="grid gap-5">
        <AdminSectionCard
          title="Basic info"
          description="Keep the primary catalog data short, typed, and ready for later API-backed validation."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Title"
              required
              helperText="This title is used in the management table and public catalog."
              error={errors["basicInfo.title"]}
            >
              <Input
                value={values.basicInfo.title}
                aria-invalid={errors["basicInfo.title"] ? true : undefined}
                onChange={(event) => onBasicInfoChange("title", event.target.value)}
                placeholder="Enter book title"
              />
            </FormField>

            <FormField
              label="Author"
              required
              helperText="Use the name as it should appear in both admin and public screens."
              error={errors["basicInfo.author"]}
            >
              <Input
                value={values.basicInfo.author}
                aria-invalid={errors["basicInfo.author"] ? true : undefined}
                onChange={(event) => onBasicInfoChange("author", event.target.value)}
                placeholder="Enter author name"
              />
            </FormField>

            <FormField
              label="ISBN"
              required
              helperText="ISBN-10 or ISBN-13 formats are accepted."
              error={errors["basicInfo.isbn"]}
            >
              <Input
                value={values.basicInfo.isbn}
                aria-invalid={errors["basicInfo.isbn"] ? true : undefined}
                onChange={(event) => onBasicInfoChange("isbn", event.target.value)}
                placeholder="978-0-123-45678-9"
              />
            </FormField>

            <FormField
              label="Category"
              required
              helperText="This category controls both admin grouping and public discovery filters."
              error={errors["basicInfo.category"]}
            >
              <select
                value={values.basicInfo.category}
                aria-invalid={errors["basicInfo.category"] ? true : undefined}
                className={cn(
                  "rounded-input border-input bg-card text-body text-foreground focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring h-11 w-full appearance-none border px-4 shadow-xs outline-none focus-visible:ring-4",
                  errors["basicInfo.category"] ? "border-danger" : undefined,
                )}
                onChange={(event) =>
                  onBasicInfoChange("category", event.target.value as AdminBookFormValues["basicInfo"]["category"])
                }
              >
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Technology">Technology</option>
                <option value="Art & Design">Art & Design</option>
                <option value="Business">Business</option>
                <option value="Travel">Travel</option>
              </select>
            </FormField>
          </div>

          <FormField
            label="Description"
            required
            helperText="Aim for a concise operational description that can later be replaced by real catalog copy."
            error={errors["basicInfo.description"]}
          >
            <textarea
              value={values.basicInfo.description}
              aria-invalid={errors["basicInfo.description"] ? true : undefined}
              className={cn(
                textareaClassName,
                errors["basicInfo.description"] ? "border-danger" : undefined,
              )}
              onChange={(event) =>
                onBasicInfoChange("description", event.target.value)
              }
              placeholder="Describe the title, its audience, and any operational notes that matter to staff."
            />
          </FormField>
        </AdminSectionCard>

        <BookCoverUploader
          author={values.basicInfo.author}
          category={values.basicInfo.category}
          error={errors["cover.fileName"]}
          fileName={values.cover.fileName ?? ""}
          mode={mode}
          onFileNameChange={onCoverFileNameChange}
          title={values.basicInfo.title}
        />

        <BookFeeSettings
          amount={values.feeSettings.amount}
          error={errors["feeSettings.amount"]}
          mode={values.feeSettings.mode}
          onAmountChange={onFeeAmountChange}
          onModeChange={onFeeModeChange}
        />

        <BookDurationSettings
          allowCustomDuration={values.durationSettings.allowCustomDuration}
          error={errors["durationSettings.presetDays"]}
          onAllowCustomDurationChange={onAllowCustomDurationChange}
          onToggleDuration={onToggleDuration}
          options={durationOptions}
          selectedDays={values.durationSettings.presetDays}
        />

        <BookMetadataSection
          errors={errors}
          metadata={values.metadata}
          onMetadataChange={onMetadataChange}
          onStatusChange={onStatusChange}
          status={values.status}
        />
      </div>

      <aside className="grid gap-5 xl:sticky xl:top-24 xl:self-start">
        {mode === "edit" && book?.inventorySummary ? (
          <AdminSectionCard
            title="Inventory summary"
            description="A live API can later replace these operational numbers. For now the panel is fed by typed mock inventory data."
          >
            <AdminDetailSection
              columns={1}
              items={[
                {
                  label: "Shelf code",
                  value: book.inventorySummary.shelfCode,
                },
                {
                  label: "Copies",
                  value: `${book.inventorySummary.availableCopies}/${book.inventorySummary.totalCopies} available`,
                  hint: `${book.inventorySummary.borrowedCopies} borrowed · ${book.inventorySummary.reservedCopies} reserved`,
                },
                {
                  label: "Last audit",
                  value: book.inventorySummary.lastAuditLabel,
                },
              ]}
            />
          </AdminSectionCard>
        ) : null}

        <AdminSectionCard
          title="Form actions"
          description="Save keeps the interaction local for now. Replace the handlers later when the admin API is ready."
        >
          <div className="grid gap-3">
            <Button type="submit" size="lg" disabled={isSubmitting || isDeleting}>
              {isSubmitting
                ? mode === "create"
                  ? "Saving draft..."
                  : "Saving changes..."
                : mode === "create"
                  ? "Save new book"
                  : "Save changes"}
            </Button>
            <Button asChild type="button" size="lg" variant="outline">
              <Link href={cancelHref}>Cancel</Link>
            </Button>
            {mode === "edit" && book ? (
              <ConfirmActionDialog
                trigger={
                  <Button
                    type="button"
                    size="lg"
                    variant="destructive"
                    disabled={isSubmitting || isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete book"}
                  </Button>
                }
                title={`Delete ${book.title}?`}
                description="This delete flow is still mock-only. Keep it here so the page is ready when destructive backend actions are introduced."
                confirmLabel="Delete book"
                tone="danger"
                onConfirm={onDelete}
              />
            ) : null}
          </div>

          {submissionState ? (
            <div
              className={cn(
                "rounded-card grid gap-1 border p-4",
                submissionState.tone === "success"
                  ? "border-success/25 bg-success-surface"
                  : "border-danger/25 bg-danger-surface",
              )}
            >
              <p className="text-label text-foreground font-medium">
                {submissionState.title}
              </p>
              <p className="text-body-sm text-text-secondary">
                {submissionState.description}
              </p>
            </div>
          ) : (
            <p className="text-body-sm text-text-secondary">
              {mode === "create"
                ? "A successful save only confirms the mock form contract for now. No real book is persisted yet."
                : "Edit mode keeps the existing inventory summary visible while the mock form simulates update and delete hooks."}
            </p>
          )}
        </AdminSectionCard>
      </aside>
    </form>
  );
}

export { BookDetailsForm, type BookDetailsFormProps };