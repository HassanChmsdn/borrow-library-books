import { env } from "@/env";
import { MongoClient, ServerApiVersion } from "mongodb";

const DEFAULT_DB_NAME = "borrow-library-books";

type GlobalMongoCache = typeof globalThis & {
  __mongoClientPromise__?: Promise<MongoClient>;
};

function assertMongoConfig() {
  if (!env.MONGODB_URI) {
    throw new Error(
      "MongoDB is not configured. Set MONGODB_URI before using the database module.",
    );
  }
}

function createMongoClient() {
  assertMongoConfig();

  return new MongoClient(env.MONGODB_URI!, {
    appName: "borrow-library-books",
    maxPoolSize: env.NODE_ENV === "development" ? 10 : 30,
    retryWrites: true,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

function createClientPromise() {
  return createMongoClient().connect();
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