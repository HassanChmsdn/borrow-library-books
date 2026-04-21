"use client";

import { AdminStatusBadge } from "@/components/admin";
import { useI18n } from "@/lib/i18n";
import { getAppRoleDisplayLabel } from "@/lib/auth/roles";

import type { AdminUserRole } from "../types";

interface UserRoleBadgeProps {
  role: AdminUserRole;
}

function UserRoleBadge({ role }: Readonly<UserRoleBadgeProps>) {
  const { translateText } = useI18n();
  const configMap = {
    super_admin: {
      label: translateText(getAppRoleDisplayLabel("super_admin")),
      tone: "warning" as const,
    },
    admin: { label: translateText(getAppRoleDisplayLabel("admin")), tone: "info" as const },
    employee: {
      label: translateText(getAppRoleDisplayLabel("employee")),
      tone: "info" as const,
    },
    financial: {
      label: translateText(getAppRoleDisplayLabel("financial")),
      tone: "success" as const,
    },
    member: {
      label: translateText(getAppRoleDisplayLabel("member")),
      tone: "neutral" as const,
    },
  };

  const config = configMap[role];

  return <AdminStatusBadge label={config.label} tone={config.tone} />;
}

export { UserRoleBadge, type UserRoleBadgeProps };