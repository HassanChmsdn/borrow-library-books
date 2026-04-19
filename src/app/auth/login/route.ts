import { NextResponse } from "next/server";

import { sanitizeRedirectTo } from "@/lib/auth";
import { isAuth0Configured, getAuth0Client } from "@/lib/auth/auth0";

function getAuthUnavailableRedirectPath(redirectTo: string) {
  return redirectTo.startsWith("/admin") ? "/admin/auth" : "/auth/sign-in";
}

export async function GET(request: Request) {
  if (!isAuth0Configured()) {
    const url = new URL(request.url);
    const redirectTo = sanitizeRedirectTo(
      url.searchParams.get("returnTo") ?? url.searchParams.get("redirectTo"),
      "/books",
    );
    const fallbackPath = getAuthUnavailableRedirectPath(redirectTo);

    return NextResponse.redirect(
      new URL(
        `${fallbackPath}?error=auth0-not-configured&redirectTo=${encodeURIComponent(redirectTo)}`,
        request.url,
      ),
    );
  }

  const client = getAuth0Client();

  if (!client) {
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=auth0-not-configured", request.url),
    );
  }

  return client.middleware(request);
}