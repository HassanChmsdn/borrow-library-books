"use client";

import * as React from "react";
import { cva } from "class-variance-authority";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type FeeBadgeTone = "free" | "paid" | "neutral";

const feeBadgeVariants = cva(
  "text-caption inline-flex max-w-full shrink-0 items-center rounded-pill px-2.5 py-1 font-medium leading-none tracking-[0.14em] uppercase whitespace-nowrap",
  {
    variants: {
      tone: {
        free: "bg-success-surface text-success",
        paid: "bg-warning-surface text-warning",
        neutral: "bg-muted text-text-secondary",
      },
    },
    defaultVariants: {
      tone: "paid",
    },
  },
);

interface FeeBadgeProps extends React.ComponentProps<"span"> {
  label: string;
  tone?: FeeBadgeTone;
}

function FeeBadge({
  className,
  label,
  tone = "paid",
  ...props
}: FeeBadgeProps) {
  const { translateText } = useI18n();

  return (
    <span
      data-slot="fee-badge"
      className={cn(feeBadgeVariants({ tone }), className)}
      {...props}
    >
      {translateText(label)}
    </span>
  );
}

export { FeeBadge, type FeeBadgeProps, type FeeBadgeTone };
