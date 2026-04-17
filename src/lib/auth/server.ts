import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { listRoleAdminSectionDefaults } from "./access-policies";
import {
  MOCK_AUTH_COOKIE,
  canAccessAdminSection,
  canManageAdminSection,
  hasAdminAccess,
  buildMockSignInHref,
  createGuestAuthState,
  createMockAuthState,
  getCurrentRole,
  getRouteAuthorization,
  getCurrentUser,
  isAdmin,
  isAuthenticated,
  isMember,
  type AppAdminSection,
  type AppAuthState,
} from "./index";
import {
  createAuth0AuthState,
  getCurrentAuth0User,
  getAuth0Session,
} from "./auth0";

export type AppSession = AppAuthState;
export type MockSession = AppAuthState;

export async function getMockSession(): Promise<AppSession> {
  const cookieStore = await cookies();
  const roleValue = cookieStore.get(MOCK_AUTH_COOKIE)?.value;
  const roleDefaults = await listRoleAdminSectionDefaults();

  return createMockAuthState(roleValue, roleDefaults);
}

export async function getCurrentSession(): Promise<AppSession> {
  const auth0Session = await getAuth0Session();
  const roleDefaults = await listRoleAdminSectionDefaults();
  const auth0State = await createAuth0AuthState(auth0Session, roleDefaults);

  if (auth0Session?.user) {
    return auth0State ?? createGuestAuthState();
  }

  return getMockSession();
}

export async function getCurrentMockUser() {
  return getCurrentUser(await getMockSession());
}

export { getAuth0Session, getCurrentAuth0User };

export async function getCurrentMockRole() {
  return getCurrentRole(await getMockSession());
}

export async function getCurrentUserSession() {
  return getCurrentUser(await getCurrentSession());
}

export async function getCurrentSessionRole() {
  return getCurrentRole(await getCurrentSession());
}

export async function requireAuthorizedRoute(pathname: string) {
  const session = await getCurrentSession();
  const authorization = getRouteAuthorization(session, pathname);

  if (authorization.isAllowed) {
    return session;
  }

  if (authorization.denialReason === "member") {
    redirect(
      buildMockSignInHref({
        role: "member",
        redirectTo: pathname,
      }),
    );
  }

  if (authorization.denialReason === "admin") {
    redirect(
      buildMockSignInHref({
        role: "admin",
        redirectTo: pathname,
      }),
    );
  }

  redirect("/admin");
}

export async function getMockAuthFlags() {
  const session = await getCurrentSession();

  return {
    isAuthenticated: isAuthenticated(session),
    isMember: isMember(session),
    isAdmin: isAdmin(session),
    hasAdminAccess: hasAdminAccess(session),
  };
}

export async function requireMemberSession(redirectTo = "/account/borrowings") {
  const session = await getCurrentSession();

  if (!isMember(session)) {
    redirect(
      buildMockSignInHref({
        role: "member",
        redirectTo,
      }),
    );
  }

  return session;
}

export async function requireAdminSession(redirectTo = "/admin") {
  const session = await getCurrentSession();

  if (!hasAdminAccess(session)) {
    redirect(
      buildMockSignInHref({
        role: "admin",
        redirectTo,
      }),
    );
  }

  return session;
}

export async function requireAdminSectionAccess(
  section: AppAdminSection,
  redirectTo = "/admin",
) {
  const session = await requireAdminSession(redirectTo);

  if (!canAccessAdminSection(session, section)) {
    redirect("/admin");
  }

  return session;
}

export async function requireAdminSectionManagement(
  section: AppAdminSection,
  redirectTo = "/admin",
) {
  const session = await requireAdminSession(redirectTo);

  if (!canManageAdminSection(session, section)) {
    redirect("/admin");
  }

  return session;
}

export const requireStaffSession = requireAdminSession;

export const requireMockMemberSession = requireMemberSession;
export const requireMockAdminSession = requireAdminSession;
