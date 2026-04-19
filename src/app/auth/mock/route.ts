import { NextResponse } from "next/server";

import { sanitizeRedirectTo } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedRole = url.searchParams.get("role");
  const redirectTo = sanitizeRedirectTo(url.searchParams.get("redirectTo"), "/books");
  const basePath = requestedRole === "admin" ? "/admin/auth" : "/auth/sign-in";

  return NextResponse.redirect(
    new URL(
      `${basePath}?redirectTo=${encodeURIComponent(redirectTo)}`,
      request.url,
    ),
  );
}