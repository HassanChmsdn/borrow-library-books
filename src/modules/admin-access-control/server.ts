import "server-only";

import {
  getAppRoleAccountLabel,
  getResolvedAdminSectionPermissions,
  hasAdminAccessRole,
  type AppUserRole,
  type AppUserStatus,
} from "@/lib/auth";
import type { AppUserAccessConfig } from "@/lib/auth/app-user-model";
import { listUserRecordsFromStore } from "@/lib/data/server";

import type { AdminAccessControlUserRecord } from "./types";

function hasSectionOverrides(access: AppUserAccessConfig | undefined) {
  return Boolean(access?.sections && Object.keys(access.sections).length > 0);
}

export function toAdminAccessControlUserRecord(record: {
  access?: AppUserAccessConfig;
  email: string;
  fullName: string;
  id: string;
  role: AppUserRole;
  status: AppUserStatus;
  subtitle?: string;
}) {
  return {
    access: record.access,
    effectivePermissions: getResolvedAdminSectionPermissions(
      record.role,
      record.access,
    ),
    email: record.email,
    fullName: record.fullName,
    hasSectionOverrides: hasSectionOverrides(record.access),
    id: record.id,
    role: record.role,
    status: record.status,
    subtitle: record.subtitle ?? getAppRoleAccountLabel(record.role),
  } satisfies AdminAccessControlUserRecord;
}

export async function listAdminAccessControlUserRecords() {
  const users = await listUserRecordsFromStore();

  return users
    .filter((user) => hasAdminAccessRole(user.role))
    .map((user) =>
      toAdminAccessControlUserRecord({
        access: user.access,
        email: user.email,
        fullName: user.fullName,
        id: user.id,
        role: user.role,
        status: user.status,
        subtitle: user.subtitle,
      }),
    )
    .sort((left, right) => left.fullName.localeCompare(right.fullName));
}