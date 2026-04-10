import { env } from "@/env";
import { MongoClient, ServerApiVersion } from "mongodb";

const DEFAULT_DB_NAME = "borrow-library-books";

type GlobalMongoCache = typeof globalThis & {
  __mongoClientPromise__?: Promise<MongoClient>;
};

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

function normalizeMongoConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

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
}

function createMongoClient() {
  assertMongoConfig();

  const directConnection = parseOptionalBoolean(env.MONGODB_DIRECT_CONNECTION);
  const tls = parseOptionalBoolean(env.MONGODB_TLS);
  const tlsAllowInvalidCertificates = parseOptionalBoolean(
    env.MONGODB_TLS_ALLOW_INVALID_CERTIFICATES,
  );
  const tlsAllowInvalidHostnames = parseOptionalBoolean(
    env.MONGODB_TLS_ALLOW_INVALID_HOSTNAMES,
  );
  const serverSelectionTimeoutMS =
    parseOptionalNumber(env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) ?? 8000;

  return new MongoClient(env.MONGODB_URI!, {
    appName: "borrow-library-books",
    directConnection,
    maxPoolSize: env.NODE_ENV === "development" ? 10 : 30,
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

export function getMongoDatabaseName() {
  return env.MONGODB_DB_NAME ?? DEFAULT_DB_NAME;
}

export async function getMongoClient() {
  if (env.NODE_ENV === "development") {
    const globalCache = globalThis as GlobalMongoCache;

    if (!globalCache.__mongoClientPromise__) {
      globalCache.__mongoClientPromise__ = createClientPromise();
    }

    return globalCache.__mongoClientPromise__;
  }

  return createClientPromise();
}