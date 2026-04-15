import {
  APP_USER_ROLE_VALUES,
  MEMBER_APP_USER_ROLE,
  STAFF_APP_USER_ROLE_VALUES,
  type AppUserRole,
  type StaffAppUserRole,
} from "./app-user-model";

const appUserRoleSet = new Set<AppUserRole>(APP_USER_ROLE_VALUES);
const staffRoleSet = new Set<AppUserRole>(STAFF_APP_USER_ROLE_VALUES);

export type AdminAccessRole = StaffAppUserRole;

export function isAppUserRole(value: unknown): value is AppUserRole {
  return typeof value === "string" && appUserRoleSet.has(value as AppUserRole);
}

export function isMemberRole(
  role: AppUserRole | null | undefined,
): role is typeof MEMBER_APP_USER_ROLE {
  return role === MEMBER_APP_USER_ROLE;
}

export function isStaffRole(
  role: AppUserRole | null | undefined,
): role is StaffAppUserRole {
  return role != null && staffRoleSet.has(role);
}

export function hasAdminAccessRole(role: AppUserRole | null | undefined) {
  return isStaffRole(role);
}

export function getDefaultRedirectForAppRole(role: AppUserRole) {
  return hasAdminAccessRole(role) ? "/admin" : "/account/borrowings";
}

export function getAppRoleDisplayLabel(role: AppUserRole) {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "employee":
      return "Employee";
    case "financial":
      return "Financial";
    case "member":
      return "Member";
  }
}

export function getAppRoleAccountLabel(role: AppUserRole) {
  if (isMemberRole(role)) {
    return "Library member";
  }

  return `${getAppRoleDisplayLabel(role)} account`;
}