import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  buildMockSignInHref,
  createAuth0AuthState,
  createGuestAuthState,
  createMockAuthState,
  getAuth0SessionForRequest,
  isAdmin,
  isMember,
  MOCK_AUTH_COOKIE,
} from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const auth0Session = await getAuth0SessionForRequest(request);
  const auth0State = createAuth0AuthState(auth0Session);
  const authState = auth0Session?.user
    ? (auth0State ?? createGuestAuthState())
    : createMockAuthState(request.cookies.get(MOCK_AUTH_COOKIE)?.value);
  const redirectTo = `${pathname}${request.nextUrl.search}`;

  if (pathname === "/admin/auth") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !isAdmin(authState)) {
    return NextResponse.redirect(
      new URL(
        buildMockSignInHref({ role: "admin", redirectTo }),
        request.url,
      ),
    );
  }

  if (pathname.startsWith("/account") && !isMember(authState)) {
    return NextResponse.redirect(
      new URL(
        buildMockSignInHref({ role: "member", redirectTo }),
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};