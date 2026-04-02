import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

type BorrowStatus =
  | "due-soon"
  | "ready-for-pickup"
  | "saved-for-later"
  | "checked-out"
  | "returned"
  | "overdue";

type BorrowStatusBadgeTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

const borrowStatusBadgeVariants = cva(
  "text-caption inline-flex max-w-full shrink-0 items-center rounded-pill border px-2.5 py-1 font-medium leading-none tracking-[0.08em] whitespace-nowrap",
  {
    variants: {
      tone: {
        success: "border-success-border bg-success-surface text-success",
        warning: "border-warning-border bg-warning-surface text-warning",
        danger: "border-danger-border bg-danger-surface text-danger",
        info: "border-info-border bg-info-surface text-info",
        neutral: "border-border-subtle bg-muted text-text-secondary",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

const borrowStatusConfig: Record<
  BorrowStatus,
  { label: string; tone: BorrowStatusBadgeTone }
> = {
  "due-soon": { label: "Due soon", tone: "warning" },
  "ready-for-pickup": { label: "Ready for pickup", tone: "info" },
  "saved-for-later": { label: "Saved for later", tone: "neutral" },
  "checked-out": { label: "Checked out", tone: "success" },
  returned: { label: "Returned", tone: "neutral" },
  overdue: { label: "Overdue", tone: "danger" },
};

interface BorrowStatusBadgeProps extends React.ComponentProps<"span"> {
  status?: BorrowStatus;
  label?: string;
  tone?: BorrowStatusBadgeTone;
}

function BorrowStatusBadge({
  className,
  label,
  status,
  tone,
  ...props
}: BorrowStatusBadgeProps) {
  const resolvedLabel =
    label ?? (status ? borrowStatusConfig[status].label : "Status");
  const resolvedTone =
    tone ?? (status ? borrowStatusConfig[status].tone : "neutral");

  return (
    <span
      data-slot="borrow-status-badge"
      className={cn(
        borrowStatusBadgeVariants({ tone: resolvedTone }),
        className,
      )}
      {...props}
    >
      {resolvedLabel}
    </span>
  );
}

export {
  BorrowStatusBadge,
  type BorrowStatus,
  type BorrowStatusBadgeProps,
  type BorrowStatusBadgeTone,
};
