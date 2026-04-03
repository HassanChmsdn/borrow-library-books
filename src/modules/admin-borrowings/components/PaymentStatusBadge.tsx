import { AdminStatusBadge, type AdminStatusBadgeTone } from "@/components/admin";
import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
  compact?: boolean;
  helperText?: string;
  label: string;
  tone: AdminStatusBadgeTone;
}

function PaymentStatusBadge({
  compact = false,
  helperText,
  label,
  tone,
}: Readonly<PaymentStatusBadgeProps>) {
  return (
    <div className={cn("space-y-1", compact ? "space-y-0.5" : null)}>
      <AdminStatusBadge label={label} tone={tone} />
      {helperText ? (
        <p
          className={cn(
            "text-caption text-text-tertiary",
            compact ? "max-w-[10rem] truncate" : null,
          )}
          title={compact ? helperText : undefined}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export { PaymentStatusBadge, type PaymentStatusBadgeProps };