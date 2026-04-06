import { Auth0Client } from "@auth0/nextjs-auth0/server";
import type { NextRequest } from "next/server";

import { env } from "@/env";

import { getAppUserRecordByIdentity } from "./app-users";
import {
  createAppAuthUser,
  createAuthenticatedAuthState,
  type AppAuthState,
} from "./mock-auth";

export function buildAuth0LoginHref(returnTo = "/books") {
  const params = new URLSearchParams({
    returnTo,
  });

  return `/auth/login?${params.toString()}`;
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

function resolveAuth0AppUser(user: Record<string, unknown> | null | undefined) {
  const subject = typeof user?.sub === "string" ? user.sub : null;

  if (!subject) {
    return null;
  }

  return getAppUserRecordByIdentity({
    provider: "auth0",
    subject,
  });
}

export function getAuth0AppRole(user: Record<string, unknown> | null | undefined) {
  return resolveAuth0AppUser(user)?.role ?? null;
}

export function createAuth0AuthState(
  session:
    | Awaited<ReturnType<typeof getAuth0Session>>
    | Awaited<ReturnType<typeof getAuth0SessionForRequest>>,
): AppAuthState | null {
  if (!session?.user) {
    return null;
  }

  const appUser = resolveAuth0AppUser(session.user);

  if (!appUser) {
    return null;
  }

  return createAuthenticatedAuthState(
    appUser.role,
    createAppAuthUser(appUser, "auth0"),
    "auth0",
  );
}

export async function getCurrentAuth0AuthState() {
  return createAuth0AuthState(await getAuth0Session());
}

export async function getCurrentAuth0AuthStateForRequest(request: NextRequest) {
  return createAuth0AuthState(await getAuth0SessionForRequest(request));
}
