import {
  AdminDetailSection,
  AdminSectionCard,
  ConfirmActionDialog,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { formatTemplate, translateNode, useI18n } from "@/lib/i18n";
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
  const { translateText } = useI18n();

  return (
    <label className="grid gap-1.5">
      <span className="text-label text-foreground font-medium">
        {translateNode(label, translateText)}
        {required ? <span className="text-danger"> *</span> : null}
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
  const { translateText } = useI18n();

  return (
    <form
      className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]"
      onSubmit={onSubmit}
    >
      <div className="grid gap-5">
        <AdminSectionCard
          title="Basic info"
          description="Keep the primary catalog data short, typed, and valid for the live catalog record."
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
                <option value="Fiction">{translateText("Fiction")}</option>
                <option value="Science">{translateText("Science")}</option>
                <option value="History">{translateText("History")}</option>
                <option value="Philosophy">{translateText("Philosophy")}</option>
                <option value="Technology">{translateText("Technology")}</option>
                <option value="Art & Design">{translateText("Art & Design")}</option>
                <option value="Business">{translateText("Business")}</option>
                <option value="Travel">{translateText("Travel")}</option>
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
              placeholder={translateText(
                "Describe the title, its audience, and any operational notes that matter to staff.",
              )}
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
            description="Current operational numbers derived from the stored copy and borrowing records for this title."
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
                  value: `${book.inventorySummary.availableCopies}/${book.inventorySummary.totalCopies} ${translateText("available")}`,
                  hint: `${book.inventorySummary.borrowedCopies} ${translateText("borrowed")} · ${book.inventorySummary.reservedCopies} ${translateText("reserved")}`,
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
          description="Saving writes catalog changes to MongoDB and refreshes the related admin and public views."
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
            <LinkButton href={cancelHref} size="lg" variant="outline">
              Cancel
            </LinkButton>
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
                title={formatTemplate(translateText("Delete {title}?"), {
                  title: book.title,
                })}
                description="Deleting removes the book and any orphaned copy records. Books with borrowing history stay protected from deletion."
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
                {translateText(submissionState.title)}
              </p>
              <p className="text-body-sm text-text-secondary">
                {translateText(submissionState.description)}
              </p>
            </div>
          ) : (
            <p className="text-body-sm text-text-secondary">
              {translateText(
                mode === "create"
                  ? "Create mode saves a new book record immediately and then routes to its detail page."
                  : "Edit mode keeps the current inventory summary visible while catalog changes are persisted and revalidated.",
              )}
            </p>
          )}
        </AdminSectionCard>
      </aside>
    </form>
  );
}

export { BookDetailsForm, type BookDetailsFormProps };