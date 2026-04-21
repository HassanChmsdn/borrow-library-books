"use client";

import * as React from "react";

import { translateNode, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const pageHeaderContentStyle = {
  maxWidth: "var(--layout-reading-max-width)",
} satisfies React.CSSProperties;

interface PageHeaderProps extends Omit<
  React.ComponentProps<"header">,
  "title"
> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  children,
  ...props
}: PageHeaderProps) {
  const { translateText } = useI18n();

  return (
    <header
      data-slot="page-header"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3" style={pageHeaderContentStyle}>
          {eyebrow ? (
            <p className="text-caption text-text-tertiary font-medium tracking-[0.24em] uppercase">
              {translateNode(eyebrow, translateText)}
            </p>
          ) : null}
          <div className="space-y-2">
            <h1 className="font-heading text-title text-foreground lg:text-title-lg font-semibold text-balance">
              {translateNode(title, translateText)}
            </h1>
            {description ? (
              <p className="text-body text-text-secondary max-w-3xl text-pretty">
                {translateNode(description, translateText)}
              </p>
            ) : null}
          </div>
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {actions}
          </div>
        ) : null}
      </div>

      {children ? <div className="flex flex-col gap-3">{children}</div> : null}
    </header>
  );
}

export { PageHeader };
