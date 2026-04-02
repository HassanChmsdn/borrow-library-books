import * as React from "react";

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
          <p className="text-body-sm text-text-secondary">{item.label}</p>
          <div className="text-body-sm text-foreground font-medium">
            {item.value}
          </div>
          {item.hint ? (
            <p className="text-caption text-text-tertiary">{item.hint}</p>
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
