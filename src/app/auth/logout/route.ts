import { NextResponse } from "next/server";

import { buildMockSignOutHref, sanitizeRedirectTo } from "@/lib/auth";
import { getAuth0Client, isAuth0Configured } from "@/lib/auth/auth0";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = sanitizeRedirectTo(
    url.searchParams.get("returnTo") ?? url.searchParams.get("redirectTo"),
    "/books",
  );

  if (!isAuth0Configured()) {
    return NextResponse.redirect(
      new URL(buildMockSignOutHref(redirectTo), request.url),
    );
  }

  const client = getAuth0Client();

  if (!client) {
    return NextResponse.redirect(new URL("/books", request.url));
  }

  const logoutUrl = new URL(request.url);
  logoutUrl.searchParams.set(
    "returnTo",
    new URL(redirectTo, request.url).toString(),
  );

  return client.middleware(new Request(logoutUrl, request));
}