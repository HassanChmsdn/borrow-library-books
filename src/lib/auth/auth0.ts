import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import { env } from "@/env";

import { ensureAuth0AppUserRecord } from "./app-users.server";
import {
  MEMBER_AUTH_REGISTRATION_NAME_COOKIE,
  sanitizePendingMemberName,
} from "./member-auth-flow";
import {
  createAppAuthUser,
  createAuthenticatedAuthState,
  type AppAuthenticatedRole,
  type AppAuthState,
} from "./mock-auth";
import {
  roleAdminSectionDefaults,
  type ResolvedAppSectionPermissions,
} from "./permissions";

export interface Auth0LoginHrefOptions {
  connection?: string;
  returnTo?: string;
  screenHint?: "login" | "signup";
}

function normalizeAuth0LoginHrefOptions(
  options?: string | Auth0LoginHrefOptions,
) {
  if (typeof options === "string") {
    return { returnTo: options };
  }

  return options ?? {};
}

function createAuth0LoginSearchParams(
  options?: string | Auth0LoginHrefOptions,
) {
  const normalizedOptions = normalizeAuth0LoginHrefOptions(options);
  const params = new URLSearchParams({
    returnTo: normalizedOptions.returnTo ?? "/books",
  });

  if (normalizedOptions.connection) {
    params.set("connection", normalizedOptions.connection);
  }

  if (normalizedOptions.screenHint) {
    params.set("screen_hint", normalizedOptions.screenHint);
  }

  return params;
}

export function buildAuth0LoginHref(options?: string | Auth0LoginHrefOptions) {
  const params = createAuth0LoginSearchParams(options);

  return `/auth/login?${params.toString()}`;
}

export function buildAuth0SignupHref(
  options?: string | Omit<Auth0LoginHrefOptions, "screenHint">,
) {
  return buildAuth0LoginHref({
    ...normalizeAuth0LoginHrefOptions(options),
    screenHint: "signup",
  });
}

let auth0Client: Auth0Client | null | undefined;

export function isAuth0Configured() {
  return Boolean(
    env.AUTH0_DOMAIN &&
    env.AUTH0_CLIENT_ID &&
    env.AUTH0_CLIENT_SECRET &&
    env.AUTH0_SECRET,
  );
}

export function getAuth0Client() {
  if (!isAuth0Configured()) {
    return null;
  }

  if (auth0Client) {
    return auth0Client;
  }

  auth0Client = new Auth0Client({
    appBaseUrl: env.APP_BASE_URL,
    clientId: env.AUTH0_CLIENT_ID,
    clientSecret: env.AUTH0_CLIENT_SECRET,
    domain: env.AUTH0_DOMAIN,
    logoutStrategy: "v2",
    secret: env.AUTH0_SECRET,
    signInReturnToPath: "/books",
  });

  return auth0Client;
}

export async function getAuth0Session() {
  const client = getAuth0Client();

  if (!client) {
    return null;
  }

  return client.getSession();
}

export async function getAuth0SessionForRequest(request: NextRequest) {
  const client = getAuth0Client();

  if (!client) {
    return null;
  }

  return client.getSession(request);
}

export async function getCurrentAuth0User() {
  const session = await getAuth0Session();

  return session?.user ?? null;
}

async function getPendingMemberRegistrationName() {
  const cookieStore = await cookies();

  return sanitizePendingMemberName(
    cookieStore.get(MEMBER_AUTH_REGISTRATION_NAME_COOKIE)?.value,
  );
}

async function resolveAuth0AppUser(
  user: Record<string, unknown> | null | undefined,
) {
  const subject = typeof user?.sub === "string" ? user.sub : null;

  if (!subject) {
    return null;
  }

  const auth0Name =
    typeof user?.name === "string"
      ? sanitizePendingMemberName(user.name)
      : null;

  return ensureAuth0AppUserRecord({
    email: typeof user?.email === "string" ? user.email : null,
    fullName: auth0Name ?? (await getPendingMemberRegistrationName()),
    subject,
  });
}

export async function getAuth0AppRole(
  user: Record<string, unknown> | null | undefined,
) {
  return (await resolveAuth0AppUser(user))?.role ?? null;
}

export async function createAuth0AuthState(
  session:
    | Awaited<ReturnType<typeof getAuth0Session>>
    | Awaited<ReturnType<typeof getAuth0SessionForRequest>>,
  roleDefaults: Record<
    AppAuthenticatedRole,
    ResolvedAppSectionPermissions
  > = roleAdminSectionDefaults,
): Promise<AppAuthState | null> {
  if (!session?.user) {
    return null;
  }

  const appUser = await resolveAuth0AppUser(session.user);

  if (!appUser) {
    return null;
  }

  return createAuthenticatedAuthState(
    appUser.role,
    createAppAuthUser(appUser, "auth0"),
    "auth0",
    roleDefaults,
  );
}

export async function getCurrentAuth0AuthState() {
  return createAuth0AuthState(await getAuth0Session());
}

export async function getCurrentAuth0AuthStateForRequest(request: NextRequest) {
  return createAuth0AuthState(await getAuth0SessionForRequest(request));
}
