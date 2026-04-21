import {
  type AppUserAccessConfig,
  APP_USER_ROLE_VALUES,
  type AppUserRole,
  type AppUserStatus,
} from "./app-user-model";

import { getMockAppUserRecord, type AppUserRecord } from "./app-users";
import {
  createEmptyResolvedAdminSectionPermissions,
  getRouteAccessPolicy,
  getResolvedAdminSectionPermissionsForDefaults,
  roleAdminSectionDefaults,
  type AppRouteAccessPolicy,
  type ResolvedAppSectionPermissions,
} from "./permissions";
import {
  isAdminRole,
  isEmployeeRole,
  isFinancialRole,
  getDefaultRedirectForAppRole,
  hasAdminAccessRole,
  isAppUserRole,
  isMemberRole,
  isSuperAdminRole,
} from "./roles";
import type { AppAdminSection } from "./app-user-model";

export const MOCK_AUTH_COOKIE = "borrow-library-mock-role";

export const mockAuthenticatedRoles = APP_USER_ROLE_VALUES;

export type AppAuthenticatedRole = AppUserRole;
export type AppAuthRole = "guest" | AppAuthenticatedRole;
export type AppAuthSource = "none" | "mock" | "auth0";

export type MockAuthenticatedRole = (typeof mockAuthenticatedRoles)[number];
export type MockAuthRole = AppAuthRole;

export interface AppAuthUser {
  id: string;
  access?: AppUserAccessConfig;
  role: AppAuthenticatedRole;
  status: AppUserStatus;
  fullName: string;
  email: string;
  monogram: string;
  subtitle: string;
  authSource: AppAuthSource;
}

export interface AppAuthState {
  currentUser: AppAuthUser | null;
  currentRole: AppAuthRole;
  currentStatus: AppUserStatus | "guest";
  sectionAccess: ResolvedAppSectionPermissions;
  canManageUsers: boolean;
  canManageBooks: boolean;
  canManageCategories: boolean;
  canManageInventory: boolean;
  canManageBorrowings: boolean;
  canViewFinancials: boolean;
  hasAdminAccess: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isStaff: boolean;
  isGuest: boolean;
  isMember: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isFinancial: boolean;
  isSuspended: boolean;
  authSource: AppAuthSource;
}

export type MockAuthUser = AppAuthUser;
export type MockAuthState = AppAuthState;
export type MockSession = AppAuthState;

export interface AppRouteAuthorizationResult {
  denialReason: "admin" | "member" | "role" | "section" | null;
  isAllowed: boolean;
  policy: AppRouteAccessPolicy | null;
}

function getInitials(fullName: string, email: string) {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }

  if (nameParts.length === 1 && nameParts[0]) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return email.slice(0, 2).toUpperCase();
}

export function isMockAuthenticatedRole(
  value: unknown,
): value is MockAuthenticatedRole {
  return isAppUserRole(value);
}

export const isMockAuthRole = isMockAuthenticatedRole;

export function createAppAuthUser(
  record: AppUserRecord,
  authSource: AppAuthSource,
): AppAuthUser {
  return {
    access: record.access,
    id: record.id,
    role: record.role,
    status: record.status,
    fullName: record.fullName,
    email: record.email,
    monogram: getInitials(record.fullName, record.email),
    subtitle: record.subtitle,
    authSource,
  };
}

export function createGuestAuthState(): AppAuthState {
  return {
    currentUser: null,
    currentRole: "guest",
    currentStatus: "guest",
    sectionAccess: createEmptyResolvedAdminSectionPermissions(),
    canManageUsers: false,
    canManageBooks: false,
    canManageCategories: false,
    canManageInventory: false,
    canManageBorrowings: false,
    canViewFinancials: false,
    hasAdminAccess: false,
    isAuthenticated: false,
    isSuperAdmin: false,
    isStaff: false,
    isGuest: true,
    isMember: false,
    isAdmin: false,
    isEmployee: false,
    isFinancial: false,
    isSuspended: false,
    authSource: "none",
  };
}

export function createAuthenticatedAuthState(
  role: AppAuthenticatedRole,
  currentUser: AppAuthUser,
  authSource: AppAuthSource,
  roleDefaults: Record<
    AppAuthenticatedRole,
    ResolvedAppSectionPermissions
  > = roleAdminSectionDefaults,
): AppAuthState {
  const isActive = currentUser.status === "active";
  const access = currentUser.access;
  const isStaff = hasAdminAccessRole(role) && isActive;
  const sectionAccess = isActive
    ? getResolvedAdminSectionPermissionsForDefaults(role, roleDefaults, access)
    : createEmptyResolvedAdminSectionPermissions();

  return {
    currentUser: {
      ...currentUser,
      role,
      authSource,
    },
    currentRole: role,
    currentStatus: currentUser.status,
    sectionAccess,
    canManageUsers: sectionAccess.users.canManage,
    canManageBooks: sectionAccess.books.canManage,
    canManageCategories: sectionAccess.categories.canManage,
    canManageInventory: sectionAccess.inventory.canManage,
    canManageBorrowings: sectionAccess.borrowings.canManage,
    canViewFinancials: sectionAccess.financial.canAccess,
    hasAdminAccess: isStaff,
    isAuthenticated: true,
    isSuperAdmin: isSuperAdminRole(role) && isActive,
    isStaff,
    isGuest: false,
    isMember: isMemberRole(role) && isActive,
    isAdmin: isAdminRole(role) && isActive,
    isEmployee: isEmployeeRole(role) && isActive,
    isFinancial: isFinancialRole(role) && isActive,
    isSuspended: !isActive,
    authSource,
  };
}

export function getMockCurrentUser(role: AppAuthenticatedRole) {
  const record = getMockAppUserRecord(role);

  if (!record) {
    throw new Error(`Missing mock app user for role: ${role}`);
  }

  return createAppAuthUser(record, "mock");
}

export function createMockAuthState(
  roleValue: unknown,
  roleDefaults: Record<
    AppAuthenticatedRole,
    ResolvedAppSectionPermissions
  > = roleAdminSectionDefaults,
): AppAuthState {
  if (!isMockAuthenticatedRole(roleValue)) {
    return createGuestAuthState();
  }

  const record = getMockAppUserRecord(roleValue);

  if (!record) {
    return createGuestAuthState();
  }

  return createAuthenticatedAuthState(
    record.role,
    createAppAuthUser(record, "mock"),
    "mock",
    roleDefaults,
  );
}

export function getCurrentUser(authState: AppAuthState) {
  return authState.currentUser;
}

export function getCurrentRole(authState: AppAuthState) {
  return authState.currentRole;
}

export function getCurrentStatus(authState: AppAuthState) {
  return authState.currentStatus;
}

export function isAuthenticated(authState: AppAuthState) {
  return authState.isAuthenticated;
}

export function isMember(authState: AppAuthState) {
  return authState.isMember;
}

export function isSuperAdmin(authState: AppAuthState) {
  return authState.isSuperAdmin;
}

export function isAdmin(authState: AppAuthState) {
  return authState.isAdmin;
}

export function isEmployee(authState: AppAuthState) {
  return authState.isEmployee;
}

export function isFinancial(authState: AppAuthState) {
  return authState.isFinancial;
}

export function hasAdminAccess(authState: AppAuthState) {
  return authState.hasAdminAccess;
}

export function isStaff(authState: AppAuthState) {
  return authState.isStaff;
}

export function isSuspended(authState: AppAuthState) {
  return authState.isSuspended;
}

export function canManageUsers(authState: AppAuthState) {
  return authState.canManageUsers;
}

export function canManageBooks(authState: AppAuthState) {
  return authState.canManageBooks;
}

export function canManageCategories(authState: AppAuthState) {
  return authState.canManageCategories;
}

export function canManageInventory(authState: AppAuthState) {
  return authState.canManageInventory;
}

export function canManageBorrowings(authState: AppAuthState) {
  return authState.canManageBorrowings;
}

export function canViewFinancials(authState: AppAuthState) {
  return authState.canViewFinancials;
}

export function getAdminSectionAccess(
  authState: AppAuthState,
  section: AppAdminSection,
) {
  return authState.sectionAccess[section];
}

export function canAccessAdminSection(
  authState: AppAuthState,
  section: AppAdminSection,
) {
  return getAdminSectionAccess(authState, section).canAccess;
}

export function canManageAdminSection(
  authState: AppAuthState,
  section: AppAdminSection,
) {
  return getAdminSectionAccess(authState, section).canManage;
}

export function getRouteAuthorization(
  authState: AppAuthState,
  pathname: string,
): AppRouteAuthorizationResult {
  const policy = getRouteAccessPolicy(pathname);

  if (!policy || policy.audience === "public") {
    return {
      denialReason: null,
      isAllowed: true,
      policy,
    };
  }

  if (policy.audience === "member") {
    return {
      denialReason: isMember(authState) ? null : "member",
      isAllowed: isMember(authState),
      policy,
    };
  }

  if (!hasAdminAccess(authState)) {
    return {
      denialReason: "admin",
      isAllowed: false,
      policy,
    };
  }

  if (
    policy.roles &&
    !policy.roles.includes(authState.currentRole as AppAuthenticatedRole)
  ) {
    return {
      denialReason: "role",
      isAllowed: false,
      policy,
    };
  }

  if (!policy.section) {
    return {
      denialReason: null,
      isAllowed: true,
      policy,
    };
  }

  const isAllowed =
    policy.level === "manage"
      ? canManageAdminSection(authState, policy.section)
      : canAccessAdminSection(authState, policy.section);

  return {
    denialReason: isAllowed ? null : "section",
    isAllowed,
    policy,
  };
}

export function canAccessRoute(authState: AppAuthState, pathname: string) {
  return getRouteAuthorization(authState, pathname).isAllowed;
}

export function getDefaultRedirectForRole(role: AppAuthenticatedRole) {
  return getDefaultRedirectForAppRole(role);
}

export function sanitizeRedirectTo(
  redirectTo: string | null | undefined,
  fallback: string,
) {
  if (
    !redirectTo ||
    !redirectTo.startsWith("/") ||
    redirectTo.startsWith("//")
  ) {
    return fallback;
  }

  return redirectTo;
}

export function buildMockSignInHref(options?: {
  role?: AppAuthenticatedRole;
  redirectTo?: string;
}) {
  const params = new URLSearchParams();
  const isAdminRoute = hasAdminAccessRole(options?.role);

  if (options?.redirectTo) {
    params.set("redirectTo", options.redirectTo);
  }

  const query = params.toString();
  const basePath = isAdminRoute ? "/admin/auth" : "/auth/sign-in";

  return query ? `${basePath}?${query}` : basePath;
}

export function buildMockAuthorizeHref(
  role: AppAuthenticatedRole,
  redirectTo: string,
) {
  const params = new URLSearchParams({
    role,
    redirectTo,
  });

  return `/auth/mock?${params.toString()}`;
}

export function buildMockSignOutHref(redirectTo = "/books") {
  const params = new URLSearchParams({ redirectTo });
  return `/auth/sign-out?${params.toString()}`;
}

export function buildSignOutHref(
  _authState: Pick<AppAuthState, "authSource">,
  redirectTo = "/books",
) {
  const params = new URLSearchParams({ returnTo: redirectTo, redirectTo });

  return `/auth/logout?${params.toString()}`;
}
