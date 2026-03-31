import * as React from "react";

import { cn } from "@/lib/utils";

interface PageActionBarProps extends Omit<
  React.ComponentProps<"section">,
  "title"
> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

function PageActionBar({
  eyebrow,
  title,
  description,
  actions,
  className,
  children,
  ...props
}: PageActionBarProps) {
  return (
    <section
      data-slot="page-action-bar"
      className={cn(
        "rounded-card border-border-subtle bg-card border px-4 py-4 shadow-xs sm:px-5 sm:py-5",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-1.5">
          {eyebrow ? (
            <p className="text-caption text-text-tertiary font-medium tracking-[0.24em] uppercase">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="text-title-sm text-foreground font-semibold text-balance">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="text-body-sm text-text-secondary max-w-3xl text-pretty">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {actions}
          </div>
        ) : null}
      </div>

      {children ? (
        <div className="border-border-subtle mt-4 border-t pt-4">
          {children}
        </div>
      ) : null}
    </section>
  );
}

export { PageActionBar };
