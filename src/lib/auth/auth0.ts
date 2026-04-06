import { Auth0Client } from "@auth0/nextjs-auth0/server";

import { env } from "@/env";

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

export async function getCurrentAuth0User() {
  const session = await getAuth0Session();

  return session?.user ?? null;
}