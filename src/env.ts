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
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
});
