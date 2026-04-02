import * as React from "react";

import { PageHeader } from "@/components/layout";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps extends Omit<
  React.ComponentProps<typeof PageHeader>,
  "children"
> {
  children?: React.ReactNode;
  controls?: React.ReactNode;
  controlsClassName?: string;
}

function AdminPageHeader({
  children,
  controls,
  controlsClassName,
  ...props
}: AdminPageHeaderProps) {
  return (
    <PageHeader {...props}>
      {controls ? (
        <div
          className={cn(
            "rounded-card border-border-subtle bg-card grid gap-4 border p-4 shadow-xs sm:p-5",
            controlsClassName,
          )}
        >
          {controls}
        </div>
      ) : null}
      {children}
    </PageHeader>
  );
}

export { AdminPageHeader, type AdminPageHeaderProps };
