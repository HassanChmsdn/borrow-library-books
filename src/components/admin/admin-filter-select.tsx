import * as React from "react";
import { ChevronDown } from "lucide-react";

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
  return (
    <label className={cn("grid gap-1.5", containerClassName)}>
      {label ? (
        <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
          {label}
        </span>
      ) : null}
      <div className="relative">
        {leadingIcon ? (
          <span className="text-text-tertiary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
            {leadingIcon}
          </span>
        ) : null}
        <select
          className={cn(
            "rounded-input border-input bg-card text-body text-foreground focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring h-11 w-full appearance-none border px-4 shadow-xs outline-none focus-visible:ring-4",
            leadingIcon ? "pl-11" : undefined,
            "pr-10",
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
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="text-text-tertiary pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
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
