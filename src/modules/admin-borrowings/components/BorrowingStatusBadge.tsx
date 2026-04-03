import { AdminStatusBadge, type AdminStatusBadgeTone } from "@/components/admin";

interface BorrowingStatusBadgeProps {
  label: string;
  tone: AdminStatusBadgeTone;
}

function BorrowingStatusBadge({
  label,
  tone,
}: Readonly<BorrowingStatusBadgeProps>) {
  return <AdminStatusBadge label={label} tone={tone} />;
}

export { BorrowingStatusBadge, type BorrowingStatusBadgeProps };