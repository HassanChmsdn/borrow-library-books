"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface BorrowDurationOption {
  value: string;
  label: string;
  supportingText?: string;
  disabled?: boolean;
}

interface BorrowDurationSelectorProps extends Omit<
  React.ComponentProps<"div">,
  "onChange"
> {
  label?: string;
  description?: string;
  name?: string;
  options: readonly BorrowDurationOption[];
  value: string;
  onValueChange?: (value: string) => void;
}

function BorrowDurationSelector({
  className,
  description,
  label,
  name,
  onValueChange,
  options,
  value,
  ...props
}: BorrowDurationSelectorProps) {
  return (
    <div
      data-slot="borrow-duration-selector"
      className={cn("space-y-3", className)}
      {...props}
    >
      {label || description ? (
        <div className="space-y-1">
          {label ? (
            <p className="text-label text-foreground font-medium">{label}</p>
          ) : null}
          {description ? (
            <p className="text-body-sm text-text-secondary">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div
        aria-label={label ?? "Borrow duration selector"}
        className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
        role="radiogroup"
      >
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <button
              key={option.value}
              aria-checked={isActive}
              className={cn(
                "focus-visible:ring-ring flex min-h-14 min-w-32 flex-1 flex-col items-start justify-center rounded-xl border px-3 py-2 text-left transition-[border-color,background-color,color,box-shadow] duration-200 focus-visible:ring-4 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:flex-none",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border-subtle bg-card text-foreground hover:border-border-strong hover:bg-elevated",
              )}
              data-name={name}
              data-state={isActive ? "checked" : "unchecked"}
              disabled={option.disabled}
              onClick={() => onValueChange?.(option.value)}
              role="radio"
              type="button"
            >
              <span className="text-label font-medium">{option.label}</span>
              {option.supportingText ? (
                <span
                  className={cn(
                    "text-caption mt-1",
                    isActive
                      ? "text-primary-foreground/80"
                      : "text-text-secondary",
                  )}
                >
                  {option.supportingText}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export {
  BorrowDurationSelector,
  type BorrowDurationOption,
  type BorrowDurationSelectorProps,
};
