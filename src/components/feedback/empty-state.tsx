"use client";

import * as React from "react";
import { cva } from "class-variance-authority";

import { translateNode, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type EmptyStateSize = "sm" | "md";

const emptyStateVariants = cva(
  "rounded-card border-border-subtle bg-elevated flex flex-col items-start gap-3 border border-dashed text-start",
  {
    variants: {
      size: {
        sm: "p-5",
        md: "p-6 sm:p-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

interface EmptyStateProps extends React.ComponentProps<"div"> {
  action?: React.ReactNode;
  description: string;
  icon?: React.ReactNode;
  size?: EmptyStateSize;
  title: string;
}

function EmptyState({
  action,
  className,
  description,
  icon,
  size = "md",
  title,
  ...props
}: EmptyStateProps) {
  const { translateText } = useI18n();

  return (
    <div
      data-slot="empty-state"
      className={cn(emptyStateVariants({ size }), className)}
      {...props}
    >
      {icon ? (
        <div className="bg-secondary text-primary flex size-12 items-center justify-center rounded-2xl">
          {icon}
        </div>
      ) : null}
      <div className="space-y-1.5">
        <h3 className="text-title-sm text-foreground font-semibold">
          {translateNode(title, translateText)}
        </h3>
        <p className="text-body-sm text-text-secondary max-w-prose">
          {translateNode(description, translateText)}
        </p>
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}

export { EmptyState, type EmptyStateProps, type EmptyStateSize };
