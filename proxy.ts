import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { listRoleAdminSectionDefaults } from "@/lib/auth/access-policies";
import {
  buildMockSignInHref,
  createGuestAuthState,
  createMockAuthState,
  getRouteAuthorization,
  MOCK_AUTH_COOKIE,
} from "@/lib/auth";
import {
  createAuth0AuthState,
  getAuth0SessionForRequest,
} from "@/lib/auth/auth0";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const roleDefaults = await listRoleAdminSectionDefaults();
  const auth0Session = await getAuth0SessionForRequest(request);
  const auth0State = await createAuth0AuthState(auth0Session, roleDefaults);
  const authState = auth0Session?.user
    ? (auth0State ?? createGuestAuthState())
    : createMockAuthState(
        request.cookies.get(MOCK_AUTH_COOKIE)?.value,
        roleDefaults,
      );
  const redirectTo = `${pathname}${request.nextUrl.search}`;

  const authorization = getRouteAuthorization(authState, pathname);

  if (!authorization.isAllowed) {
    if (authorization.denialReason === "member") {
      return NextResponse.redirect(
        new URL(
          buildMockSignInHref({ role: "member", redirectTo }),
          request.url,
        ),
      );
    }

    if (authorization.denialReason === "admin") {
      return NextResponse.redirect(
        new URL(
          buildMockSignInHref({ role: "admin", redirectTo }),
          request.url,
        ),
      );
    }

    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
