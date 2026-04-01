import * as React from "react";
import { cva } from "class-variance-authority";

import {
  AvailabilityBadge,
  type AvailabilityBadgeTone,
} from "./availability-badge";
import { FeeBadge, type FeeBadgeTone } from "./fee-badge";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BookCardStatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const bookCardStatusVariants = cva(
  "text-caption inline-flex items-center rounded-pill border px-2.5 py-1 font-medium tracking-[0.18em] uppercase",
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

interface BookCardProps {
  action?: React.ReactNode;
  author: string;
  availabilityLabel: string;
  availabilityTone?: AvailabilityBadgeTone;
  category: string;
  className?: string;
  feeLabel?: string;
  feeTone?: FeeBadgeTone;
  statusLabel?: string;
  statusTone?: BookCardStatusTone;
  title: string;
}

function BookCard({
  action,
  author,
  availabilityLabel,
  availabilityTone = "neutral",
  category,
  className,
  feeLabel,
  feeTone = "paid",
  statusLabel,
  statusTone = "neutral",
  title,
}: BookCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="gap-4">
        {statusLabel || feeLabel ? (
          <div className="flex items-start justify-between gap-3">
            {statusLabel ? (
              <span className={bookCardStatusVariants({ tone: statusTone })}>
                {statusLabel}
              </span>
            ) : (
              <span />
            )}
            {feeLabel ? <FeeBadge label={feeLabel} tone={feeTone} /> : null}
          </div>
        ) : null}

        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{author}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="border-border-subtle flex items-center justify-between gap-3 border-t border-dashed pt-4">
        <div className="min-w-0 space-y-2">
          <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
            {category}
          </p>
          <AvailabilityBadge
            label={availabilityLabel}
            tone={availabilityTone}
          />
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

export { BookCard, type BookCardProps, type BookCardStatusTone };
