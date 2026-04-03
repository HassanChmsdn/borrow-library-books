import { NextResponse } from "next/server";

import {
  getDefaultRedirectForRole,
  isMockAuthRole,
  MOCK_AUTH_COOKIE,
  sanitizeRedirectTo,
} from "@/lib/auth/mock-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedRole = url.searchParams.get("role");

  if (!isMockAuthRole(requestedRole)) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  const redirectTo = sanitizeRedirectTo(
    url.searchParams.get("redirectTo"),
    getDefaultRedirectForRole(requestedRole),
  );

  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  response.cookies.set(MOCK_AUTH_COOKIE, requestedRole, {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
  });

  return response;
}