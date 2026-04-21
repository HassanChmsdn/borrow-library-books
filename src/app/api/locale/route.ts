import { NextResponse } from "next/server";

import {
  defaultLocale,
  isSupportedLocale,
  localeCookieName,
  type AppLocale,
} from "@/lib/i18n";

interface SetLocaleRequestBody {
  locale?: AppLocale;
}

export async function POST(request: Request) {
  const body = (await request.json()) as SetLocaleRequestBody;
  const locale = isSupportedLocale(body.locale) ? body.locale : defaultLocale;
  const response = NextResponse.json({ locale, ok: true });

  response.cookies.set(localeCookieName, locale, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}