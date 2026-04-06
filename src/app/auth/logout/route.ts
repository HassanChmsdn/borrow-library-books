import { NextResponse } from "next/server";

import { buildMockSignOutHref, sanitizeRedirectTo } from "@/lib/auth";
import { getAuth0Client, isAuth0Configured } from "@/lib/auth/auth0";

export async function GET(request: Request) {
  if (!isAuth0Configured()) {
    const url = new URL(request.url);
    const redirectTo = sanitizeRedirectTo(url.searchParams.get("returnTo"), "/books");

    return NextResponse.redirect(
      new URL(buildMockSignOutHref(redirectTo), request.url),
    );
  }

  const client = getAuth0Client();

  if (!client) {
    return NextResponse.redirect(new URL("/books", request.url));
  }

  return client.middleware(request);
}