import "server-only";

import {
  APP_USER_ROLE_VALUES,
  getAppRoleAccountLabel,
  getResolvedAdminSectionPermissionsForDefaults,
  type AppUserRole,
  type AppUserStatus,
} from "@/lib/auth";
import { listRoleAdminSectionDefaults } from "@/lib/auth/access-policies";
import type { AppUserAccessConfig } from "@/lib/auth/app-user-model";
import { listUserRecordsFromStore } from "@/lib/data/server";

import type {
  AdminAccessControlRolePolicyRecord,
  AdminAccessControlUserRecord,
} from "./types";

function hasSectionOverrides(access: AppUserAccessConfig | undefined) {
  return Boolean(access?.sections && Object.keys(access.sections).length > 0);
}

export function toAdminAccessControlUserRecord(record: {
  access?: AppUserAccessConfig;
  email: string;
  effectivePermissions: ReturnType<
    typeof getResolvedAdminSectionPermissionsForDefaults
  >;
  fullName: string;
  id: string;
  role: AppUserRole;
  status: AppUserStatus;
  subtitle?: string;
}) {
  return {
    access: record.access,
    effectivePermissions: record.effectivePermissions,
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
  const [users, roleDefaults] = await Promise.all([
    listUserRecordsFromStore(),
    listRoleAdminSectionDefaults(),
  ]);

  return users
    .map((user) =>
      toAdminAccessControlUserRecord({
        access: user.access,
        email: user.email,
        effectivePermissions: getResolvedAdminSectionPermissionsForDefaults(
          user.role,
          roleDefaults,
          user.access,
        ),
        fullName: user.fullName,
        id: user.id,
        role: user.role,
        status: user.status,
        subtitle: user.subtitle,
      }),
    )
    .sort((left, right) => left.fullName.localeCompare(right.fullName));
}

export async function listAdminAccessControlRolePolicyRecords() {
  const roleDefaults = await listRoleAdminSectionDefaults();

  return APP_USER_ROLE_VALUES.filter((role) => role !== "member")
    .map((role) => ({
      effectivePermissions: roleDefaults[role],
      role,
    }))
    .sort((left, right) =>
      left.role.localeCompare(right.role),
    ) satisfies ReadonlyArray<AdminAccessControlRolePolicyRecord>;
}
