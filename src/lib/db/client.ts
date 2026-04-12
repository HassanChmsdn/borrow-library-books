import "server-only";

export {
  getMongoClient,
  getMongoDatabaseName,
  hasExplicitMongoDatabaseName,
  isMongoConfigured,
} from "./core/client";

export {
  checkDatabaseReadiness,
  type DatabaseDiagnostic,
  type DatabaseDiagnosticCode,
  type DatabaseDiagnosticLevel,
  type DatabaseReadinessResult,
} from "./core/diagnostics";

export {
  initializeDatabase,
  type DatabaseInitializationResult,
} from "./core/init";