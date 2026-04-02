import * as React from "react";

import { cn } from "@/lib/utils";

interface AdminDataTableProps extends Omit<
  React.ComponentProps<"section">,
  "title"
> {
  actions?: React.ReactNode;
  children: React.ReactNode;
  description?: React.ReactNode;
  title?: React.ReactNode;
}

function AdminDataTable({
  actions,
  children,
  className,
  description,
  title,
  ...props
}: AdminDataTableProps) {
  return (
    <section className={cn("space-y-4", className)} {...props}>
      {title || description || actions ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            {title ? (
              <h2 className="text-title-sm text-foreground font-semibold">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-body-sm text-text-secondary">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export { AdminDataTable, type AdminDataTableProps };
