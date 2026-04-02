import * as React from "react";

import {
  EmptyState,
  type EmptyStateProps,
  type EmptyStateSize,
} from "@/components/feedback";

interface AdminEmptyStateProps extends EmptyStateProps {
  size?: EmptyStateSize;
}

function AdminEmptyState({ size = "sm", ...props }: AdminEmptyStateProps) {
  return <EmptyState size={size} {...props} />;
}

export { AdminEmptyState, type AdminEmptyStateProps };
