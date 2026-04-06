import { NextResponse } from "next/server";

import { getAuth0Client, isAuth0Configured } from "@/lib/auth/auth0";

export async function GET(request: Request) {
  if (!isAuth0Configured()) {
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=auth0-not-configured", request.url),
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