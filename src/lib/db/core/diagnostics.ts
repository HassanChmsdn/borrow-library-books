import {
  getMongoAppEnvironment,
  getMongoClient,
  getMongoDatabaseName,
  hasExplicitMongoDatabaseName,
  isMongoConfigured,
} from "./client";

export type DatabaseDiagnosticLevel = "info" | "warning" | "error";

export type DatabaseDiagnosticCode =
  | "missing-uri"
  | "missing-db-name"
  | "invalid-uri"
  | "authentication-failed"
  | "server-selection-timeout"
  | "tls-handshake-failed"
  | "unknown-error"
  | "ready";

export interface DatabaseDiagnostic {
  level: DatabaseDiagnosticLevel;
  code: DatabaseDiagnosticCode;
  message: string;
}

export interface DatabaseReadinessResult {
  ok: boolean;
  connected: boolean;
  appEnv: ReturnType<typeof getMongoAppEnvironment>;
  databaseName: string;
  diagnostics: DatabaseDiagnostic[];
}

function classifyDiagnosticCode(message: string): DatabaseDiagnosticCode {
  if (/not configured/i.test(message)) {
    return "missing-uri";
  }

  if (/connection string is invalid/i.test(message)) {
    return "invalid-uri";
  }

  if (/authentication failed/i.test(message)) {
    return "authentication-failed";
  }

  if (/server selection timed out/i.test(message)) {
    return "server-selection-timeout";
  }

  if (/tls handshake failed/i.test(message)) {
    return "tls-handshake-failed";
  }

  return "unknown-error";
}

export async function checkDatabaseReadiness(): Promise<DatabaseReadinessResult> {
  const diagnostics: DatabaseDiagnostic[] = [];
  const appEnv = getMongoAppEnvironment();
  const databaseName = getMongoDatabaseName();

  if (!isMongoConfigured()) {
    diagnostics.push({
      code: "missing-uri",
      level: "error",
      message:
        "MongoDB is not configured. Set MONGODB_URI before using the database module.",
    });

    return {
      appEnv,
      connected: false,
      databaseName,
      diagnostics,
      ok: false,
    };
  }

  if (!hasExplicitMongoDatabaseName()) {
    diagnostics.push({
      code: "missing-db-name",
      level: "warning",
      message: `MONGODB_DB_NAME is not set. Falling back to the default database name \"${databaseName}\".`,
    });
  }

  try {
    const client = await getMongoClient();
    await client.db(databaseName).command({ ping: 1 });

    diagnostics.push({
      code: "ready",
      level: "info",
      message: "MongoDB connection is ready.",
    });

    return {
      appEnv,
      connected: true,
      databaseName,
      diagnostics,
      ok: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    diagnostics.push({
      code: classifyDiagnosticCode(message),
      level: "error",
      message,
    });

    return {
      appEnv,
      connected: false,
      databaseName,
      diagnostics,
      ok: false,
    };
  }
}