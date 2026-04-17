import { AdminStatusBadge } from "@/components/admin";
import { getAppRoleDisplayLabel } from "@/lib/auth/roles";

import type { AdminUserRole } from "../types";

interface UserRoleBadgeProps {
  role: AdminUserRole;
}

function UserRoleBadge({ role }: Readonly<UserRoleBadgeProps>) {
  const configMap = {
    super_admin: { label: getAppRoleDisplayLabel("super_admin"), tone: "warning" as const },
    admin: { label: getAppRoleDisplayLabel("admin"), tone: "info" as const },
    employee: { label: getAppRoleDisplayLabel("employee"), tone: "info" as const },
    financial: { label: getAppRoleDisplayLabel("financial"), tone: "success" as const },
    member: { label: getAppRoleDisplayLabel("member"), tone: "neutral" as const },
  };

  const config = configMap[role];

  return <AdminStatusBadge label={config.label} tone={config.tone} />;
}

export { UserRoleBadge, type UserRoleBadgeProps };