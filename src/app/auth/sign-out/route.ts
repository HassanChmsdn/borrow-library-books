import { NextResponse } from "next/server";

import { MOCK_AUTH_COOKIE, sanitizeRedirectTo } from "@/lib/auth/mock-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = sanitizeRedirectTo(url.searchParams.get("redirectTo"), "/books");
  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  response.cookies.set(MOCK_AUTH_COOKIE, "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return response;
}