import * as React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  className?: string;
  icon?: React.ReactNode;
  label: string;
  supportingText: string;
  trend?: React.ReactNode;
  value: string;
}

function AdminStatCard({
  className,
  icon,
  label,
  supportingText,
  trend,
  value,
}: AdminStatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="gap-3.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-text-tertiary text-[0.625rem] leading-4 font-medium tracking-[0.16em] uppercase sm:text-[0.6875rem]">
            {label}
          </p>
          <div className="flex items-center gap-2">
            {trend ? (
              <span className="text-text-secondary text-[0.6875rem] leading-4 font-medium sm:text-caption">
                {trend}
              </span>
            ) : null}
            {icon ? (
              <span className="bg-secondary text-primary flex size-9 items-center justify-center rounded-lg sm:size-10 sm:rounded-xl">
                {icon}
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <CardTitle className="text-title-lg">{value}</CardTitle>
          <CardDescription className="max-w-[18rem]">
            {supportingText}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

export { AdminStatCard, type AdminStatCardProps };
