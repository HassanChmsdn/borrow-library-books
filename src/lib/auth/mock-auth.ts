export const MOCK_AUTH_COOKIE = "borrow-library-mock-role";

export const mockAuthenticatedRoles = ["member", "admin"] as const;

export type MockAuthenticatedRole = (typeof mockAuthenticatedRoles)[number];
export type MockAuthRole = "guest" | MockAuthenticatedRole;

export interface MockAuthUser {
  id: string;
  role: MockAuthenticatedRole;
  fullName: string;
  email: string;
  monogram: string;
  subtitle: string;
}

export interface MockAuthState {
  currentUser: MockAuthUser | null;
  currentRole: MockAuthRole;
  isAuthenticated: boolean;
  isGuest: boolean;
  isMember: boolean;
  isAdmin: boolean;
}

export type MockSession = MockAuthState;

const mockUsers: Record<MockAuthenticatedRole, MockAuthUser> = {
  member: {
    id: "member-sara-chehab",
    role: "member",
    fullName: "Sara Chehab",
    email: "sara.chehab@library.test",
    monogram: "SC",
    subtitle: "Member account",
  },
  admin: {
    id: "admin-samir-chahine",
    role: "admin",
    fullName: "Samir Chahine",
    email: "samir.chahine@library.test",
    monogram: "SC",
    subtitle: "Shift lead account",
  },
};

export function isMockAuthenticatedRole(
  value: unknown,
): value is MockAuthenticatedRole {
  return (
    typeof value === "string" &&
    mockAuthenticatedRoles.includes(value as MockAuthenticatedRole)
  );
}

export const isMockAuthRole = isMockAuthenticatedRole;

export function getMockCurrentUser(role: MockAuthenticatedRole) {
  return mockUsers[role];
}

export function createMockAuthState(roleValue: unknown): MockAuthState {
  if (!isMockAuthenticatedRole(roleValue)) {
    return {
      currentUser: null,
      currentRole: "guest",
      isAuthenticated: false,
      isGuest: true,
      isMember: false,
      isAdmin: false,
    };
  }

  return {
    currentUser: getMockCurrentUser(roleValue),
    currentRole: roleValue,
    isAuthenticated: true,
    isGuest: false,
    isMember: roleValue === "member",
    isAdmin: roleValue === "admin",
  };
}

export function getCurrentUser(authState: MockAuthState) {
  return authState.currentUser;
}

export function getCurrentRole(authState: MockAuthState) {
  return authState.currentRole;
}

export function isAuthenticated(authState: MockAuthState) {
  return authState.isAuthenticated;
}

export function isMember(authState: MockAuthState) {
  return authState.isMember;
}

export function isAdmin(authState: MockAuthState) {
  return authState.isAdmin;
}

export function getDefaultRedirectForRole(role: MockAuthenticatedRole) {
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
  role?: MockAuthenticatedRole;
  redirectTo?: string;
}) {
  const params = new URLSearchParams();

  if (options?.role) {
    params.set("role", options.role);
  }

  if (options?.redirectTo) {
    params.set("redirectTo", options.redirectTo);
  }

  const query = params.toString();
  return query ? `/auth/sign-in?${query}` : "/auth/sign-in";
}

export function buildMockAuthorizeHref(
  role: MockAuthenticatedRole,
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