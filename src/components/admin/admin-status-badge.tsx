import * as React from "react";

import {
  BorrowStatusBadge,
  type BorrowStatusBadgeTone,
} from "@/components/library";

type AdminStatusBadgeTone = BorrowStatusBadgeTone;

interface AdminStatusBadgeProps extends React.ComponentProps<
  typeof BorrowStatusBadge
> {
  tone?: AdminStatusBadgeTone;
}

function AdminStatusBadge(props: AdminStatusBadgeProps) {
  return <BorrowStatusBadge {...props} />;
}

export {
  AdminStatusBadge,
  type AdminStatusBadgeProps,
  type AdminStatusBadgeTone,
};
