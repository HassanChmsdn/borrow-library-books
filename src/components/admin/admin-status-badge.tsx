import * as React from "react";

import {
  BorrowStatusBadge,
  type BorrowStatusBadgeTone,
} from "@/components/library";
import { cn } from "@/lib/utils";

type AdminStatusBadgeTone = BorrowStatusBadgeTone;

interface AdminStatusBadgeProps extends React.ComponentProps<
  typeof BorrowStatusBadge
> {
  density?: "compact" | "default";
  tone?: AdminStatusBadgeTone;
}

function AdminStatusBadge({
  className,
  density = "compact",
  ...props
}: AdminStatusBadgeProps) {
  return (
    <BorrowStatusBadge
      className={cn(
        "max-w-full shrink-0 whitespace-nowrap px-2 py-[0.3125rem] text-[0.625rem] leading-none tracking-[0.12em] sm:text-[0.6875rem]",
        density === "default" ? "px-2.5 py-1" : null,
        className,
      )}
      {...props}
    />
  );
}

export {
  AdminStatusBadge,
  type AdminStatusBadgeProps,
  type AdminStatusBadgeTone,
};
