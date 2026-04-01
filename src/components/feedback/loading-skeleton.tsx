import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LoadingSkeletonVariant = "card" | "kpi" | "table";

interface LoadingSkeletonProps extends React.ComponentProps<"div"> {
  count?: number;
  variant?: LoadingSkeletonVariant;
}

function LoadingSkeleton({
  className,
  count = 1,
  variant = "card",
  ...props
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, index) => index);

  return (
    <div
      data-slot="loading-skeleton"
      className={cn(
        variant === "kpi"
          ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          : "grid gap-4",
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        if (variant === "kpi") {
          return (
            <Card key={item}>
              <CardHeader className="gap-4">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="size-10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardHeader>
            </Card>
          );
        }

        if (variant === "table") {
          return (
            <div
              key={item}
              className="border-border-subtle bg-card rounded-xl border"
            >
              <div className="border-border-subtle bg-elevated flex items-center gap-4 border-b px-4 py-3">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="ml-auto h-3 w-24" />
              </div>
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          );
        }

        return (
          <Card key={item}>
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="rounded-pill h-7 w-20" />
                <Skeleton className="rounded-pill h-7 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="rounded-pill h-8 w-28" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export {
  LoadingSkeleton,
  type LoadingSkeletonProps,
  type LoadingSkeletonVariant,
};
