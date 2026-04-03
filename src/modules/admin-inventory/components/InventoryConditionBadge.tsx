import { AdminStatusBadge } from "@/components/admin";

import {
  adminInventoryConditionLabels,
  adminInventoryConditionTones,
} from "../mock-data";

import type { AdminInventoryCondition } from "../types";

interface InventoryConditionBadgeProps {
  condition: AdminInventoryCondition;
}

function InventoryConditionBadge({
  condition,
}: Readonly<InventoryConditionBadgeProps>) {
  return (
    <AdminStatusBadge
      label={adminInventoryConditionLabels[condition]}
      tone={adminInventoryConditionTones[condition]}
    />
  );
}

export { InventoryConditionBadge, type InventoryConditionBadgeProps };