import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  server: {
    APP_BASE_URL: z.string().url().optional(),
    AUTH0_CLIENT_ID: z.string().min(1).optional(),
    AUTH0_CLIENT_SECRET: z.string().min(1).optional(),
    AUTH0_DOMAIN: z.string().min(1).optional(),
    AUTH0_SECRET: z.string().min(1).optional(),
    MONGODB_DB_NAME: z.string().min(1).optional(),
    MONGODB_DIRECT_CONNECTION: z.string().min(1).optional(),
    MONGODB_SERVER_SELECTION_TIMEOUT_MS: z.string().min(1).optional(),
    MONGODB_TLS: z.string().min(1).optional(),
    MONGODB_TLS_ALLOW_INVALID_CERTIFICATES: z.string().min(1).optional(),
    MONGODB_TLS_ALLOW_INVALID_HOSTNAMES: z.string().min(1).optional(),
    MONGODB_URI: z.string().min(1).optional(),
  },
  client: {},
  runtimeEnv: {
    APP_BASE_URL: process.env.APP_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    MONGODB_DIRECT_CONNECTION: process.env.MONGODB_DIRECT_CONNECTION,
    MONGODB_SERVER_SELECTION_TIMEOUT_MS:
      process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
    MONGODB_TLS: process.env.MONGODB_TLS,
    MONGODB_TLS_ALLOW_INVALID_CERTIFICATES:
      process.env.MONGODB_TLS_ALLOW_INVALID_CERTIFICATES,
    MONGODB_TLS_ALLOW_INVALID_HOSTNAMES:
      process.env.MONGODB_TLS_ALLOW_INVALID_HOSTNAMES,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
});
