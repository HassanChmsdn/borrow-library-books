import { AdminStatusBadge, type AdminStatusBadgeTone } from "@/components/admin";

interface PaymentStatusBadgeProps {
  helperText?: string;
  label: string;
  tone: AdminStatusBadgeTone;
}

function PaymentStatusBadge({
  helperText,
  label,
  tone,
}: Readonly<PaymentStatusBadgeProps>) {
  return (
    <div className="space-y-1">
      <AdminStatusBadge label={label} tone={tone} />
      {helperText ? (
        <p className="text-caption text-text-tertiary">{helperText}</p>
      ) : null}
    </div>
  );
}

export { PaymentStatusBadge, type PaymentStatusBadgeProps };