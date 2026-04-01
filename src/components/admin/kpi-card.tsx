import * as React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  className?: string;
  icon?: React.ReactNode;
  label: string;
  supportingText: string;
  trend?: React.ReactNode;
  value: string;
}

function KpiCard({
  className,
  icon,
  label,
  supportingText,
  trend,
  value,
}: KpiCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
            {label}
          </p>
          <div className="flex items-center gap-2">
            {trend ? (
              <span className="text-caption text-text-secondary">{trend}</span>
            ) : null}
            {icon ? (
              <span className="bg-secondary text-primary flex size-10 items-center justify-center rounded-xl">
                {icon}
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <CardTitle className="text-title-lg">{value}</CardTitle>
          <CardDescription className="mt-1">{supportingText}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

export { KpiCard, type KpiCardProps };
