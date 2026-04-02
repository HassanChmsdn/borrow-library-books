import * as React from "react";

import { cn } from "@/lib/utils";

import { AdminStatCard, type AdminStatCardProps } from "./admin-stat-card";

interface AdminMetricStripProps {
  className?: string;
  columnsClassName?: string;
  items: ReadonlyArray<AdminStatCardProps>;
}

function AdminMetricStrip({
  className,
  columnsClassName,
  items,
}: AdminMetricStripProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
        columnsClassName,
        className,
      )}
    >
      {items.map((item) => (
        <AdminStatCard key={item.label} {...item} />
      ))}
    </div>
  );
}

export { AdminMetricStrip, type AdminMetricStripProps };
