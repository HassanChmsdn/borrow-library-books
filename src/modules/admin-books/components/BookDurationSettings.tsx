import { AdminSectionCard } from "@/components/admin";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type {
  AdminBookDurationOption,
  AdminBookDurationPreset,
} from "../types";

interface BookDurationSettingsProps {
  allowCustomDuration: boolean;
  error?: string;
  onAllowCustomDurationChange: (value: boolean) => void;
  onToggleDuration: (days: AdminBookDurationPreset) => void;
  options: ReadonlyArray<AdminBookDurationOption>;
  selectedDays: ReadonlyArray<AdminBookDurationPreset>;
}

function BookDurationSettings({
  allowCustomDuration,
  error,
  onAllowCustomDurationChange,
  onToggleDuration,
  options,
  selectedDays,
}: BookDurationSettingsProps) {
  const { dir, translateText } = useI18n();

  return (
    <AdminSectionCard
      title="Borrowing durations"
      description="Select the predefined durations staff can approve quickly, then choose whether librarians may accept a custom duration request."
    >
      <div className="grid gap-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {options.map((option) => {
            const isSelected = selectedDays.includes(option.days);

            return (
              <button
                key={option.days}
                type="button"
                aria-pressed={isSelected}
                className={cn(
                  "rounded-card border-border-subtle bg-card grid gap-1.5 border p-4 text-start transition-colors",
                  isSelected
                    ? "border-border-strong bg-elevated shadow-xs"
                    : "hover:border-border-strong",
                )}
                onClick={() => onToggleDuration(option.days)}
              >
                <span className="text-label text-foreground font-medium">
                  {translateText(option.label)}
                </span>
                <span className="text-body-sm text-text-secondary">
                  {translateText(option.helperText)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 rounded-card border border-dashed border-black/5 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
          <div className="space-y-1">
            <p className="text-label text-foreground font-medium">
              {translateText("Allow custom duration requests")}
            </p>
            <p className="text-body-sm text-text-secondary">
              {translateText(
                "Turn this on when staff may approve a non-standard duration after review.",
              )}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={allowCustomDuration}
            className={cn(
              "relative h-8 w-14 rounded-full transition-colors",
              allowCustomDuration ? "bg-success" : "bg-muted",
            )}
            onClick={() => onAllowCustomDurationChange(!allowCustomDuration)}
          >
            <span
              className={cn(
                "bg-card absolute top-1 start-1 size-6 rounded-full shadow-sm transition-transform",
                allowCustomDuration
                  ? dir === "rtl"
                    ? "-translate-x-6"
                    : "translate-x-6"
                  : undefined,
              )}
            />
          </button>
        </div>

        <div className="grid gap-1">
          <p className="text-body-sm text-text-secondary">
            {translateText("Selected presets:")} {selectedDays.length > 0 ? selectedDays.join(", ") : translateText("None")} {translateText(selectedDays.length === 1 ? "day" : "days")}
          </p>
          {error ? (
            <p className="text-body-sm text-danger" role="alert">
              {translateText(error)}
            </p>
          ) : null}
        </div>
      </div>
    </AdminSectionCard>
  );
}

export { BookDurationSettings, type BookDurationSettingsProps };