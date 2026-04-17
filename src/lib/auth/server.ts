import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  MOCK_AUTH_COOKIE,
  hasAdminAccess,
  buildMockSignInHref,
  createGuestAuthState,
  createMockAuthState,
  getCurrentRole,
  getCurrentUser,
  isAdmin,
  isAuthenticated,
  isMember,
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

  return createMockAuthState(roleValue);
}

export async function getCurrentSession(): Promise<AppSession> {
  const auth0Session = await getAuth0Session();
  const auth0State = await createAuth0AuthState(auth0Session);

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

export const requireStaffSession = requireAdminSession;

export const requireMockMemberSession = requireMemberSession;
export const requireMockAdminSession = requireAdminSession;