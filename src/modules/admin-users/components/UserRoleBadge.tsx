import { AdminStatusBadge } from "@/components/admin";

import type { AdminUserRole } from "../types";

interface UserRoleBadgeProps {
  role: AdminUserRole;
}

function UserRoleBadge({ role }: Readonly<UserRoleBadgeProps>) {
  const config =
    role === "admin"
      ? { label: "Admin", tone: "info" as const }
      : { label: "User", tone: "neutral" as const };

  return <AdminStatusBadge label={config.label} tone={config.tone} />;
}

export { UserRoleBadge, type UserRoleBadgeProps };