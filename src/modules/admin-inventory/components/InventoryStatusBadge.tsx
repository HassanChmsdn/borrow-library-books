import { AdminStatusBadge } from "@/components/admin";

import {
  adminInventoryStatusLabels,
  adminInventoryStatusTones,
} from "../mock-data";

import type { AdminInventoryStatus } from "../types";

interface InventoryStatusBadgeProps {
  status: AdminInventoryStatus;
}

function InventoryStatusBadge({ status }: Readonly<InventoryStatusBadgeProps>) {
  return (
    <AdminStatusBadge
      label={adminInventoryStatusLabels[status]}
      tone={adminInventoryStatusTones[status]}
    />
  );
}

export { InventoryStatusBadge, type InventoryStatusBadgeProps };