"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { translateNode, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface AdminFilterOption<T extends string> {
  label: React.ReactNode;
  value: T;
}

interface AdminFilterSelectProps<T extends string> extends Omit<
  React.ComponentProps<"select">,
  "children" | "value"
> {
  className?: string;
  containerClassName?: string;
  label?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  onValueChange?: (value: T) => void;
  options: ReadonlyArray<AdminFilterOption<T>>;
  value: T;
}

function AdminFilterSelect<T extends string>({
  className,
  containerClassName,
  label,
  leadingIcon,
  onChange,
  onValueChange,
  options,
  value,
  ...props
}: AdminFilterSelectProps<T>) {
  const { translateText } = useI18n();

  return (
    <label className={cn("grid gap-1.5", containerClassName)}>
      {label ? (
        <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
          {translateNode(label, translateText)}
        </span>
      ) : null}
      <div className="relative">
        {leadingIcon ? (
          <span className="text-text-tertiary pointer-events-none absolute top-1/2 start-4 -translate-y-1/2">
            {leadingIcon}
          </span>
        ) : null}
        <select
          className={cn(
            "rounded-input border-input bg-card text-body text-foreground focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring h-11 w-full appearance-none border px-4 shadow-xs outline-none focus-visible:ring-4",
            leadingIcon ? "ps-11" : undefined,
            "pe-10",
            className,
          )}
          value={value}
          onChange={(event) => {
            onChange?.(event);
            onValueChange?.(event.target.value as T);
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {typeof option.label === "string"
                ? translateText(option.label)
                : option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="text-text-tertiary pointer-events-none absolute top-1/2 end-4 size-4 -translate-y-1/2"
        />
      </div>
    </label>
  );
}

export {
  AdminFilterSelect,
  type AdminFilterOption,
  type AdminFilterSelectProps,
};
