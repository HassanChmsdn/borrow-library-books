import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  AdminEmptyState,
  type AdminEmptyStateProps,
} from "./admin-empty-state";

interface AdminErrorStateProps
  extends Omit<AdminEmptyStateProps, "description" | "title"> {
  action?: React.ReactNode;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  title?: string;
}

function AdminErrorState({
  action,
  className,
  description =
    "This admin view could not be prepared right now. Try again, or return later once the underlying data source is available.",
  onRetry,
  retryLabel = "Try again",
  title = "Something went wrong",
  ...props
}: AdminErrorStateProps) {
  const resolvedAction =
    action ??
    (onRetry ? (
      <Button type="button" size="sm" variant="outline" onClick={onRetry}>
        {retryLabel}
      </Button>
    ) : null);

  return (
    <AdminEmptyState
      title={title}
      description={description}
      action={resolvedAction}
      icon={<AlertTriangle className="size-5" />}
      className={cn(
        "border-danger-border/70 bg-danger-surface/35 border-solid",
        className,
      )}
      {...props}
    />
  );
}

export { AdminErrorState, type AdminErrorStateProps };