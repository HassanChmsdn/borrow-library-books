import { AdminSectionCard, AdminStatusBadge } from "@/components/admin";
import { Input } from "@/components/ui/input";
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
  return (
    <AdminSectionCard
      title="Publication metadata"
      description="Capture optional publication context now so real API integration later has a typed surface for editor metadata and operational status."
      actions={
        <AdminStatusBadge
          label={status === "active" ? "Active" : "Inactive"}
          tone={status === "active" ? "success" : "warning"}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-label text-foreground font-medium">Publisher</span>
          <Input
            value={metadata.publisher}
            aria-invalid={errors["metadata.publisher"] ? true : undefined}
            onChange={(event) => onMetadataChange("publisher", event.target.value)}
            placeholder="Publisher or imprint"
          />
          <span className="text-body-sm text-text-secondary">
            Leave blank when this metadata is not yet available from the catalog source.
          </span>
          {errors["metadata.publisher"] ? (
            <span className="text-body-sm text-danger" role="alert">
              {errors["metadata.publisher"]}
            </span>
          ) : null}
        </label>

        <label className="grid gap-1.5">
          <span className="text-label text-foreground font-medium">Publication year</span>
          <Input
            inputMode="numeric"
            value={metadata.publishedYear}
            aria-invalid={errors["metadata.publishedYear"] ? true : undefined}
            onChange={(event) => onMetadataChange("publishedYear", event.target.value)}
            placeholder="e.g. 2015"
          />
          <span className="text-body-sm text-text-secondary">
            Use a four-digit year when known.
          </span>
          {errors["metadata.publishedYear"] ? (
            <span className="text-body-sm text-danger" role="alert">
              {errors["metadata.publishedYear"]}
            </span>
          ) : null}
        </label>

        <label className="grid gap-1.5">
          <span className="text-label text-foreground font-medium">Language</span>
          <Input
            value={metadata.language}
            aria-invalid={errors["metadata.language"] ? true : undefined}
            onChange={(event) => onMetadataChange("language", event.target.value)}
            placeholder="Primary language"
          />
          {errors["metadata.language"] ? (
            <span className="text-body-sm text-danger" role="alert">
              {errors["metadata.language"]}
            </span>
          ) : null}
        </label>

        <label className="grid gap-1.5">
          <span className="text-label text-foreground font-medium">Edition</span>
          <Input
            value={metadata.edition}
            aria-invalid={errors["metadata.edition"] ? true : undefined}
            onChange={(event) => onMetadataChange("edition", event.target.value)}
            placeholder="Edition or format"
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
          Record status
        </span>
        <select
          className={cn(selectClassName, errors.status ? "border-danger" : undefined)}
          value={status}
          aria-invalid={errors.status ? true : undefined}
          onChange={(event) => onStatusChange(event.target.value as AdminBookFormStatus)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span className="text-body-sm text-text-secondary">
          Inactive records remain in admin management but can later be hidden from public discovery.
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