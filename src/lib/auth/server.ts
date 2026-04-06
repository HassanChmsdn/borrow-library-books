import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  MOCK_AUTH_COOKIE,
  buildMockSignInHref,
  createMockAuthState,
  getCurrentRole,
  getCurrentUser,
  isAdmin,
  isAuthenticated,
  isMember,
  type MockAuthState,
} from "./index";
import { getCurrentAuth0User, getAuth0Session } from "./auth0";

export type MockSession = MockAuthState;

export async function getMockSession(): Promise<MockSession> {
  const cookieStore = await cookies();
  const roleValue = cookieStore.get(MOCK_AUTH_COOKIE)?.value;

  return createMockAuthState(roleValue);
}

export async function getCurrentMockUser() {
  return getCurrentUser(await getMockSession());
}

export { getAuth0Session, getCurrentAuth0User };

export async function getCurrentMockRole() {
  return getCurrentRole(await getMockSession());
}

export async function getMockAuthFlags() {
  const session = await getMockSession();

  return {
    isAuthenticated: isAuthenticated(session),
    isMember: isMember(session),
    isAdmin: isAdmin(session),
  };
}

export async function requireMockMemberSession(redirectTo = "/account/borrowings") {
  const session = await getMockSession();

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

export async function requireMockAdminSession(redirectTo = "/admin") {
  const session = await getMockSession();

  if (!isAdmin(session)) {
    redirect(
      buildMockSignInHref({
        role: "admin",
        redirectTo,
      }),
    );
  }

  return session;
}