"use client";

import * as React from "react";

import { translateNode, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface AdminDetailItem {
  hint?: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
}

interface AdminDetailSectionProps extends React.ComponentProps<"div"> {
  columns?: 1 | 2;
  items: ReadonlyArray<AdminDetailItem>;
}

function AdminDetailSection({
  className,
  columns = 1,
  items,
  ...props
}: AdminDetailSectionProps) {
  const { translateText } = useI18n();

  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-black/5 p-4",
        columns === 2 ? "grid gap-3 sm:grid-cols-2" : "grid gap-3",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => (
        <div key={`${String(item.label)}-${index}`} className="space-y-1">
          <p className="text-body-sm text-text-secondary">
            {translateNode(item.label, translateText)}
          </p>
          <div className="text-body-sm text-foreground font-medium">
            {translateNode(item.value, translateText)}
          </div>
          {item.hint ? (
            <p className="text-caption text-text-tertiary">
              {translateNode(item.hint, translateText)}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export {
  AdminDetailSection,
  type AdminDetailItem,
  type AdminDetailSectionProps,
};
