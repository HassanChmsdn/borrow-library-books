import { AdminSectionCard } from "@/components/admin";
import { FeeBadge } from "@/components/library";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  formatBookFeeLabel,
  getBookFeeTone,
} from "@/modules/catalog/book-presentation";

import type { AdminBookFeeMode } from "../types";

interface BookFeeSettingsProps {
  amount: string;
  error?: string;
  mode: AdminBookFeeMode;
  onAmountChange: (amount: string) => void;
  onModeChange: (mode: AdminBookFeeMode) => void;
}

function BookFeeSettings({
  amount,
  error,
  mode,
  onAmountChange,
  onModeChange,
}: BookFeeSettingsProps) {
  const { translateText } = useI18n();
  const previewFeeCents =
    mode === "free" || amount.length === 0 ? 0 : Math.round(Number(amount) * 100);

  return (
    <AdminSectionCard
      title="Fee settings"
      description="Keep the fee treatment explicit so circulation staff can see whether a title is free or collected in cash onsite."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
        <div className="grid gap-2">
          <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
            {translateText("Fee mode")}
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {([
              {
                description: "No pickup cash collected",
                label: "Free",
                value: "free",
              },
              {
                description: "Collected at the desk",
                label: "Cash fee",
                value: "cash",
              },
            ] as const).map((option) => {
              const isActive = mode === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                          "rounded-card border-border-subtle bg-card text-start transition-colors",
                    "grid gap-1 border p-4",
                    isActive
                      ? "border-border-strong bg-elevated shadow-xs"
                      : "hover:border-border-strong",
                  )}
                  onClick={() => onModeChange(option.value)}
                >
                  <span className="text-label text-foreground font-medium">
                    {translateText(option.label)}
                  </span>
                  <span className="text-body-sm text-text-secondary">
                    {translateText(option.description)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
              {translateText("Cash fee amount")}
            </span>
            <div className="relative">
              <span className="text-text-tertiary pointer-events-none absolute top-1/2 start-4 -translate-y-1/2">
                $
              </span>
                    <Input
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                aria-invalid={error ? true : undefined}
                      className="ps-8"
                disabled={mode === "free"}
                onChange={(event) => onAmountChange(event.target.value)}
              />
            </div>
            <span className="text-body-sm text-text-secondary">
              {translateText(
                mode === "free"
                  ? "Free titles keep the fee input disabled and will show a Free badge in the management table."
                  : "Enter the cash amount collected onsite when a reader picks up the book.",
              )}
            </span>
            {error ? (
              <span className="text-body-sm text-danger" role="alert">
                {translateText(error)}
              </span>
            ) : null}
          </label>

          <div className="rounded-card border-border-subtle bg-elevated grid gap-2 border p-4">
            <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
              {translateText("Fee preview")}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <FeeBadge
                label={formatBookFeeLabel(previewFeeCents)}
                tone={getBookFeeTone(previewFeeCents)}
              />
              <span className="text-body-sm text-text-secondary">
                {translateText("This mirrors how the fee appears in catalog and admin table rows.")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminSectionCard>
  );
}

export { BookFeeSettings, type BookFeeSettingsProps };