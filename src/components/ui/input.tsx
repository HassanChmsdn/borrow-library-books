"use client";

import * as React from "react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  placeholder,
  title,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentProps<"input">) {
  const { translateText } = useI18n();

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "rounded-input border-input bg-card text-body text-foreground file:text-body placeholder:text-placeholder disabled:bg-muted disabled:text-muted-foreground focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:bg-danger-surface/40 aria-invalid:ring-destructive/20 flex h-11 w-full min-w-0 border px-4 py-2 shadow-xs transition-[border-color,box-shadow,background-color,color] duration-200 outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium focus-visible:ring-4 disabled:pointer-events-none disabled:cursor-not-allowed",
        className,
      )}
      aria-label={
        typeof ariaLabel === "string" ? translateText(ariaLabel) : ariaLabel
      }
      placeholder={
        typeof placeholder === "string"
          ? translateText(placeholder)
          : placeholder
      }
      title={typeof title === "string" ? translateText(title) : title}
      {...props}
    />
  );
}

export { Input };
