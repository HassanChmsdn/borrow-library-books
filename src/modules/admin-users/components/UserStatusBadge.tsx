import { AdminStatusBadge } from "@/components/admin";

import type { AdminUserStatus } from "../types";

interface UserStatusBadgeProps {
  status: AdminUserStatus;
}

function UserStatusBadge({ status }: Readonly<UserStatusBadgeProps>) {
  const config =
    status === "active"
      ? { label: "Active", tone: "success" as const }
      : { label: "Suspended", tone: "danger" as const };

  return <AdminStatusBadge label={config.label} tone={config.tone} />;
}

export { UserStatusBadge, type UserStatusBadgeProps };