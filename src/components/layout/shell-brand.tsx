import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface ShellBrandProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  monogram?: React.ReactNode;
  href?: string;
  className?: string;
}

function ShellBrand({
  title,
  subtitle,
  monogram,
  href = "/",
  className,
}: ShellBrandProps) {
  const content = (
    <>
      {monogram ? (
        <span className="bg-secondary text-primary rounded-pill border-border-subtle text-caption inline-flex size-10 shrink-0 items-center justify-center border font-semibold uppercase shadow-xs">
          {monogram}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-col">
        {subtitle ? (
          <span className="text-caption text-text-tertiary truncate font-medium tracking-[0.24em] uppercase">
            {subtitle}
          </span>
        ) : null}
        <span className="font-heading text-title-sm text-foreground truncate font-semibold">
          {title}
        </span>
      </span>
    </>
  );

  if (!href) {
    return (
      <div
        data-slot="shell-brand"
        className={cn("inline-flex min-w-0 items-center gap-3", className)}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      data-slot="shell-brand"
      className={cn(
        "focus-visible:ring-ring/60 focus-visible:ring-offset-background inline-flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90 focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
    >
      {content}
    </Link>
  );
}

export { ShellBrand };
