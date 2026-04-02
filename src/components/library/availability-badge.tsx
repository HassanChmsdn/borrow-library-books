import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

type AvailabilityBadgeTone =
  | "available"
  | "limited"
  | "unavailable"
  | "neutral";

const availabilityBadgeVariants = cva(
  "text-caption inline-flex max-w-full shrink-0 items-center rounded-pill border px-2.5 py-1 font-medium leading-none whitespace-nowrap",
  {
    variants: {
      tone: {
        available: "border-success-border bg-success-surface text-success",
        limited: "border-warning-border bg-warning-surface text-warning",
        unavailable: "border-danger-border bg-danger-surface text-danger",
        neutral: "border-border-subtle bg-muted text-text-secondary",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

interface AvailabilityBadgeProps extends React.ComponentProps<"span"> {
  label: string;
  tone?: AvailabilityBadgeTone;
}

function AvailabilityBadge({
  className,
  label,
  tone = "neutral",
  ...props
}: AvailabilityBadgeProps) {
  return (
    <span
      data-slot="availability-badge"
      className={cn(availabilityBadgeVariants({ tone }), className)}
      {...props}
    >
      {label}
    </span>
  );
}

export {
  AvailabilityBadge,
  type AvailabilityBadgeProps,
  type AvailabilityBadgeTone,
};
