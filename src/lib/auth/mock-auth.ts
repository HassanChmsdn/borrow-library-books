import {
  getMockAppUserRecord,
  type AppUserRecord,
  type AppUserStatus,
} from "./app-users";

export const MOCK_AUTH_COOKIE = "borrow-library-mock-role";

export const mockAuthenticatedRoles = ["member", "admin"] as const;

export type AppAuthenticatedRole = (typeof mockAuthenticatedRoles)[number];
export type AppAuthRole = "guest" | AppAuthenticatedRole;
export type AppAuthSource = "none" | "mock" | "auth0";

export type MockAuthenticatedRole = AppAuthenticatedRole;
export type MockAuthRole = AppAuthRole;

export interface AppAuthUser {
  id: string;
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
  isAuthenticated: boolean;
  isGuest: boolean;
  isMember: boolean;
  isAdmin: boolean;
  isSuspended: boolean;
  authSource: AppAuthSource;
}

export type MockAuthUser = AppAuthUser;
export type MockAuthState = AppAuthState;
export type MockSession = AppAuthState;

function getInitials(fullName: string, email: string) {
  const nameParts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

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
): value is AppAuthenticatedRole {
  return (
    typeof value === "string" &&
    mockAuthenticatedRoles.includes(value as AppAuthenticatedRole)
  );
}

export const isMockAuthRole = isMockAuthenticatedRole;

export function createAppAuthUser(
  record: AppUserRecord,
  authSource: AppAuthSource,
): AppAuthUser {
  return {
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
    isAuthenticated: false,
    isGuest: true,
    isMember: false,
    isAdmin: false,
    isSuspended: false,
    authSource: "none",
  };
}

export function createAuthenticatedAuthState(
  role: AppAuthenticatedRole,
  currentUser: AppAuthUser,
  authSource: AppAuthSource,
): AppAuthState {
  const isActive = currentUser.status === "active";

  return {
    currentUser: {
      ...currentUser,
      role,
      authSource,
    },
    currentRole: role,
    currentStatus: currentUser.status,
    isAuthenticated: true,
    isGuest: false,
    isMember: role === "member" && isActive,
    isAdmin: role === "admin" && isActive,
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

export function createMockAuthState(roleValue: unknown): AppAuthState {
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

export function isAdmin(authState: AppAuthState) {
  return authState.isAdmin;
}

export function isSuspended(authState: AppAuthState) {
  return authState.isSuspended;
}

export function getDefaultRedirectForRole(role: AppAuthenticatedRole) {
  return role === "admin" ? "/admin" : "/account/borrowings";
}

export function sanitizeRedirectTo(
  redirectTo: string | null | undefined,
  fallback: string,
) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return fallback;
  }

  return redirectTo;
}

export function buildMockSignInHref(options?: {
  role?: AppAuthenticatedRole;
  redirectTo?: string;
}) {
  const params = new URLSearchParams();
  const isAdminRoute = options?.role === "admin";

  if (options?.role && !isAdminRoute) {
    params.set("role", options.role);
  }

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
  authState: Pick<AppAuthState, "authSource">,
  redirectTo = "/books",
) {
  const params = new URLSearchParams({ returnTo: redirectTo, redirectTo });

  if (authState.authSource === "auth0") {
    return `/auth/logout?${params.toString()}`;
  }

  return buildMockSignOutHref(redirectTo);
}
