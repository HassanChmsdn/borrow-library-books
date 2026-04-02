import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
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
  return (
    <label className={cn("relative block", containerClassName)}>
      <span className="sr-only">{label ?? placeholder ?? "Search"}</span>
      <span className="text-text-tertiary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
        {icon ?? <Search aria-hidden="true" className="size-4" />}
      </span>
      <Input
        type="search"
        placeholder={placeholder}
        className={cn("pl-11", className)}
        {...props}
      />
    </label>
  );
}

export { AdminSearchBar, type AdminSearchBarProps };
