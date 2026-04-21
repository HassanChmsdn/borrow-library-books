"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface AdminSearchBarProps extends Omit<
  React.ComponentProps<typeof Input>,
  "type"
> {
  containerClassName?: string;
  icon?: React.ReactNode;
  label?: string;
}

function AdminSearchBar({
  className,
  containerClassName,
  icon,
  label,
  placeholder,
  ...props
}: AdminSearchBarProps) {
  const { translateText } = useI18n();

  return (
    <label className={cn("relative block", containerClassName)}>
      <span className="sr-only">
        {translateText(label ?? placeholder ?? "Search")}
      </span>
      <span className="text-text-tertiary pointer-events-none absolute top-1/2 start-4 -translate-y-1/2">
        {icon ?? <Search aria-hidden="true" className="size-4" />}
      </span>
      <Input
        type="search"
        placeholder={placeholder ? translateText(placeholder) : undefined}
        className={cn("ps-11", className)}
        {...props}
      />
    </label>
  );
}

export { AdminSearchBar, type AdminSearchBarProps };
