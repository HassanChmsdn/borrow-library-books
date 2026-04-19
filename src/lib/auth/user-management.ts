import type { AppUserRole } from "./app-user-model";
import type { AppAuthState } from "./mock-auth";
import { canManageAdminSection, isAdmin, isSuperAdmin } from "./mock-auth";

const operationalAssignableRoles = [
  "admin",
  "employee",
  "financial",
  "member",
] as const satisfies ReadonlyArray<AppUserRole>;

export function canAdministrativelyManageUsers(authState: AppAuthState) {
  return (
    canManageAdminSection(authState, "users") &&
    (isAdmin(authState) || isSuperAdmin(authState))
  );
}

export function canExplicitlyManageSuperAdmins(authState: AppAuthState) {
  return (
    canAdministrativelyManageUsers(authState) &&
    isSuperAdmin(authState) &&
    canManageAdminSection(authState, "accessControl")
  );
}

export function getAssignableAppUserRoles(
  authState: AppAuthState,
): ReadonlyArray<AppUserRole> {
  if (!canAdministrativelyManageUsers(authState)) {
    return [];
  }

  return canExplicitlyManageSuperAdmins(authState)
    ? (["super_admin", ...operationalAssignableRoles] as const)
    : operationalAssignableRoles;
}

export function canAssignAppUserRole(
  authState: AppAuthState,
  role: AppUserRole,
) {
  return getAssignableAppUserRoles(authState).includes(role);
}

export function canManageAppUserRecord(
  authState: AppAuthState,
  role: AppUserRole,
) {
  if (!canAdministrativelyManageUsers(authState)) {
    return false;
  }

  if (role === "super_admin") {
    return canExplicitlyManageSuperAdmins(authState);
  }

  return true;
}

export function canCreateAppUsers(authState: AppAuthState) {
  return canAdministrativelyManageUsers(authState);
}