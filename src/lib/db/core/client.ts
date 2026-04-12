import { env } from "@/env";
import { MongoClient, ServerApiVersion } from "mongodb";

const DEFAULT_DB_NAME = "borrow-library-books";
const DEFAULT_SERVER_SELECTION_TIMEOUT_MS = 8000;

type GlobalMongoCache = typeof globalThis & {
  __mongoClientPromise__?: Promise<MongoClient>;
};

type MongoAppEnv = "local" | "development" | "staging" | "production";

function parseOptionalBoolean(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return undefined;
}

function parseOptionalNumber(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getMongoAppEnv(): MongoAppEnv {
  if (env.APP_ENV) {
    return env.APP_ENV;
  }

  return env.NODE_ENV === "production" ? "production" : "local";
}

function isLocalMongoUri(uri: string) {
  return /^mongodb:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$)/i.test(uri);
}

function isValidMongoUri(uri: string) {
  return /^mongodb(\+srv)?:\/\/[^/?#]+/i.test(uri);
}

function normalizeMongoConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const name = error instanceof Error ? error.name : "Error";

  if (
    /Invalid scheme, expected connection string to start with|Invalid connection string|URI must include hostname|mongodb\+srv URI cannot have port number|options? .* not supported|must be a string/i.test(
      `${name} ${message}`,
    )
  ) {
    return new Error(
      "MongoDB connection string is invalid. Set MONGODB_URI to a valid mongodb:// or mongodb+srv:// connection string.",
      { cause: error instanceof Error ? error : undefined },
    );
  }

  if (/authentication failed|auth failed|bad auth|sasl|unauthorized/i.test(message)) {
    return new Error(
      "MongoDB authentication failed. Verify the username, password, auth database, and the configured MONGODB_URI.",
      { cause: error instanceof Error ? error : undefined },
    );
  }

  if (
    /server selection timed out|serverselectionerror|topology was destroyed|econnrefused|enotfound|getaddrinfo|failed to connect/i.test(
      `${name} ${message}`,
    )
  ) {
    return new Error(
      "MongoDB server selection timed out. Verify that the server is reachable, the host name is correct, and your network or allowlist permits access.",
      { cause: error instanceof Error ? error : undefined },
    );
  }

  if (/ssl|tls|alert internal error|protocol version/i.test(message)) {
    return new Error(
      "MongoDB TLS handshake failed. Verify the cluster network allowlist, TLS settings, and the configured MONGODB_URI. Optional TLS env flags are available if your environment requires custom client settings.",
      { cause: error instanceof Error ? error : undefined },
    );
  }

  return error instanceof Error ? error : new Error(message);
}

function assertMongoConfig() {
  if (!env.MONGODB_URI) {
    throw new Error(
      "MongoDB is not configured. Set MONGODB_URI before using the database module.",
    );
  }

  if (!isValidMongoUri(env.MONGODB_URI)) {
    throw new Error(
      "MongoDB connection string is invalid. Set MONGODB_URI to a valid mongodb:// or mongodb+srv:// connection string.",
    );
  }
}

function createMongoClient() {
  assertMongoConfig();

  const mongoUri = env.MONGODB_URI!;
  const appEnv = getMongoAppEnv();
  const configuredDirectConnection = parseOptionalBoolean(
    env.MONGODB_DIRECT_CONNECTION,
  );
  const directConnection =
    configuredDirectConnection ??
    (appEnv === "local" && isLocalMongoUri(mongoUri) ? true : undefined);
  const tls = parseOptionalBoolean(env.MONGODB_TLS);
  const tlsAllowInvalidCertificates = parseOptionalBoolean(
    env.MONGODB_TLS_ALLOW_INVALID_CERTIFICATES,
  );
  const tlsAllowInvalidHostnames = parseOptionalBoolean(
    env.MONGODB_TLS_ALLOW_INVALID_HOSTNAMES,
  );
  const serverSelectionTimeoutMS =
    parseOptionalNumber(env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) ??
    DEFAULT_SERVER_SELECTION_TIMEOUT_MS;

  return new MongoClient(mongoUri, {
    appName: "borrow-library-books",
    directConnection,
    maxPoolSize: appEnv === "local" ? 10 : 30,
    retryWrites: true,
    serverSelectionTimeoutMS,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    tls,
    tlsAllowInvalidCertificates,
    tlsAllowInvalidHostnames,
  });
}

async function createClientPromise() {
  try {
    return await createMongoClient().connect();
  } catch (error) {
    throw normalizeMongoConnectionError(error);
  }
}

export function isMongoConfigured() {
  return Boolean(env.MONGODB_URI);
}

export function getMongoAppEnvironment() {
  return getMongoAppEnv();
}

export function hasExplicitMongoDatabaseName() {
  return Boolean(env.MONGODB_DB_NAME);
}

export function getMongoDatabaseName() {
  return env.MONGODB_DB_NAME ?? DEFAULT_DB_NAME;
}

export async function getMongoClient() {
  if (getMongoAppEnv() === "local" || env.NODE_ENV === "development") {
    const globalCache = globalThis as GlobalMongoCache;

    if (!globalCache.__mongoClientPromise__) {
      globalCache.__mongoClientPromise__ = createClientPromise();
    }

    return globalCache.__mongoClientPromise__;
  }

  return createClientPromise();
}