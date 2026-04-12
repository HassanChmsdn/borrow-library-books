import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const [{ getMongoClient }, { initializeDatabase }] = await Promise.all([
    import("@/lib/db/core/client"),
    import("@/lib/db/core/init"),
  ]);

  const client = await getMongoClient();

  try {
    const result = await initializeDatabase();

    console.log(
      `Database initialized for ${result.databaseName}: ${result.initializedCollections.length} collections, ${result.appliedValidators.length} validators, ${result.ensuredIndexes.length} indexes.`,
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Database initialization failed:", error);
  process.exitCode = 1;
});