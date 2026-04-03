import {
  AdminStatusBadge,
  type AdminStatusBadgeProps,
  type AdminStatusBadgeTone,
} from "@/components/admin";

interface BorrowingStatusBadgeProps {
  density?: AdminStatusBadgeProps["density"];
  label: string;
  tone: AdminStatusBadgeTone;
}

function BorrowingStatusBadge({
  density,
  label,
  tone,
}: Readonly<BorrowingStatusBadgeProps>) {
  return <AdminStatusBadge density={density} label={label} tone={tone} />;
}

export { BorrowingStatusBadge, type BorrowingStatusBadgeProps };