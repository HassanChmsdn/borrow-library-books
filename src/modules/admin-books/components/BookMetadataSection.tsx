"use client";

import { AdminSectionCard, AdminStatusBadge } from "@/components/admin";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type {
  AdminBookFormStatus,
  AdminBookFormValues,
} from "../types";

const selectClassName =
  "rounded-input border-input bg-card text-body text-foreground focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring h-11 w-full appearance-none border px-4 shadow-xs outline-none focus-visible:ring-4";

interface BookMetadataSectionProps {
  errors: Partial<Record<string, string>>;
  metadata: AdminBookFormValues["metadata"];
  onMetadataChange: <Field extends keyof AdminBookFormValues["metadata"]>(
    field: Field,
    value: AdminBookFormValues["metadata"][Field],
  ) => void;
  onStatusChange: (status: AdminBookFormStatus) => void;
  status: AdminBookFormStatus;
}

function BookMetadataSection({
  errors,
  metadata,
  onMetadataChange,
  onStatusChange,
  status,
}: BookMetadataSectionProps) {
  const { translateText } = useI18n();

  return (
    <AdminSectionCard
      title={translateText("Publication metadata")}
      description={translateText(
        "Capture optional publication context now so real API integration later has a typed surface for editor metadata and operational status.",
      )}
      actions={
        <AdminStatusBadge
          label={translateText(status === "active" ? "Active" : "Inactive")}
          tone={status === "active" ? "success" : "warning"}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-label text-foreground font-medium">
            {translateText("Publisher")}
          </span>
          <Input
            value={metadata.publisher}
            aria-invalid={errors["metadata.publisher"] ? true : undefined}
            onChange={(event) => onMetadataChange("publisher", event.target.value)}
            placeholder={translateText("Publisher or imprint")}
          />
          <span className="text-body-sm text-text-secondary">
            {translateText(
              "Leave blank when this metadata is not yet available from the catalog source.",
            )}
          </span>
          {errors["metadata.publisher"] ? (
            <span className="text-body-sm text-danger" role="alert">
              {errors["metadata.publisher"]}
            </span>
          ) : null}
        </label>

        <label className="grid gap-1.5">
          <span className="text-label text-foreground font-medium">
            {translateText("Publication year")}
          </span>
          <Input
            inputMode="numeric"
            value={metadata.publishedYear}
            aria-invalid={errors["metadata.publishedYear"] ? true : undefined}
            onChange={(event) => onMetadataChange("publishedYear", event.target.value)}
            placeholder={translateText("e.g. 2015")}
          />
          <span className="text-body-sm text-text-secondary">
            {translateText("Use a four-digit year when known.")}
          </span>
          {errors["metadata.publishedYear"] ? (
            <span className="text-body-sm text-danger" role="alert">
              {errors["metadata.publishedYear"]}
            </span>
          ) : null}
        </label>

        <label className="grid gap-1.5">
          <span className="text-label text-foreground font-medium">
            {translateText("Language")}
          </span>
          <Input
            value={metadata.language}
            aria-invalid={errors["metadata.language"] ? true : undefined}
            onChange={(event) => onMetadataChange("language", event.target.value)}
            placeholder={translateText("Primary language")}
          />
          {errors["metadata.language"] ? (
            <span className="text-body-sm text-danger" role="alert">
              {errors["metadata.language"]}
            </span>
          ) : null}
        </label>

        <label className="grid gap-1.5">
          <span className="text-label text-foreground font-medium">
            {translateText("Edition")}
          </span>
          <Input
            value={metadata.edition}
            aria-invalid={errors["metadata.edition"] ? true : undefined}
            onChange={(event) => onMetadataChange("edition", event.target.value)}
            placeholder={translateText("Edition or format")}
          />
          {errors["metadata.edition"] ? (
            <span className="text-body-sm text-danger" role="alert">
              {errors["metadata.edition"]}
            </span>
          ) : null}
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
          {translateText("Record status")}
        </span>
        <select
          className={cn(selectClassName, errors.status ? "border-danger" : undefined)}
          value={status}
          aria-invalid={errors.status ? true : undefined}
          onChange={(event) => onStatusChange(event.target.value as AdminBookFormStatus)}
        >
          <option value="active">{translateText("Active")}</option>
          <option value="inactive">{translateText("Inactive")}</option>
        </select>
        <span className="text-body-sm text-text-secondary">
          {translateText(
            "Inactive records remain in admin management but can later be hidden from public discovery.",
          )}
        </span>
        {errors.status ? (
          <span className="text-body-sm text-danger" role="alert">
            {errors.status}
          </span>
        ) : null}
      </label>
    </AdminSectionCard>
  );
}

export { BookMetadataSection, type BookMetadataSectionProps };