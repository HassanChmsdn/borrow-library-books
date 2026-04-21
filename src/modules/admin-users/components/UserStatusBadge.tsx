"use client";

import { AdminStatusBadge } from "@/components/admin";
import { useI18n } from "@/lib/i18n";

import type { AdminUserStatus } from "../types";

interface UserStatusBadgeProps {
  status: AdminUserStatus;
}

function UserStatusBadge({ status }: Readonly<UserStatusBadgeProps>) {
  const { translateText } = useI18n();
  const config =
    status === "active"
      ? { label: translateText("Active"), tone: "success" as const }
      : { label: translateText("Suspended"), tone: "danger" as const };

  return <AdminStatusBadge label={config.label} tone={config.tone} />;
}

export { UserStatusBadge, type UserStatusBadgeProps };