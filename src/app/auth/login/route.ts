import { NextResponse } from "next/server";

import { sanitizeRedirectTo } from "@/lib/auth";
import { isAuth0Configured, getAuth0Client } from "@/lib/auth/auth0";

export async function GET(request: Request) {
  if (!isAuth0Configured()) {
    const url = new URL(request.url);
    const redirectTo = sanitizeRedirectTo(
      url.searchParams.get("returnTo") ?? url.searchParams.get("redirectTo"),
      "/books",
    );

    return NextResponse.redirect(
      new URL(`/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`, request.url),
    );
  }

  const client = getAuth0Client();

  if (!client) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return client.middleware(request);
}