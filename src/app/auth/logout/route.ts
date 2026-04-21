import { NextRequest, NextResponse } from "next/server";

import { MOCK_AUTH_COOKIE, sanitizeRedirectTo } from "@/lib/auth";
import { getAuth0Client, getAuth0SessionForRequest } from "@/lib/auth/auth0";

function clearMockAuthCookie(response: NextResponse) {
  response.cookies.set(MOCK_AUTH_COOKIE, "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const redirectTo = sanitizeRedirectTo(
    url.searchParams.get("returnTo") ?? url.searchParams.get("redirectTo"),
    "/books",
  );

  const auth0Session = await getAuth0SessionForRequest(request);
  const client = getAuth0Client();

  if (!auth0Session || !client) {
    return clearMockAuthCookie(
      NextResponse.redirect(new URL(redirectTo, request.url)),
    );
  }

  const logoutUrl = new URL(request.url);
  logoutUrl.searchParams.set(
    "returnTo",
    new URL(redirectTo, request.url).toString(),
  );

  return client.middleware(new Request(logoutUrl, request));
}