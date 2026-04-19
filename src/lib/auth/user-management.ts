import type { AppUserRole } from "./app-user-model";
import type { AppAuthState } from "./mock-auth";
import { canManageAdminSection, isAdmin, isSuperAdmin } from "./mock-auth";

const accessControlAssignableRoles = [
  "admin",
  "employee",
  "financial",
] as const satisfies ReadonlyArray<Exclude<AppUserRole, "member">>;

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

export function canManageAccessControl(authState: AppAuthState) {
  return canManageAdminSection(authState, "accessControl");
}

export function getManageableAccessControlRoles(
  authState: AppAuthState,
): ReadonlyArray<Exclude<AppUserRole, "member">> {
  if (!canManageAccessControl(authState)) {
    return [];
  }

  return canExplicitlyManageSuperAdmins(authState)
    ? (["super_admin", ...accessControlAssignableRoles] as const)
    : accessControlAssignableRoles;
}

export function canManageAccessControlRolePolicy(
  authState: AppAuthState,
  role: Exclude<AppUserRole, "member">,
) {
  return getManageableAccessControlRoles(authState).includes(role);
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