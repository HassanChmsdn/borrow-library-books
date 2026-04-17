import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

type RawCliOptions = Record<string, string | boolean>;

interface ProvisionCliOptions {
  auth0UserId: string;
  avatarUrl?: string;
  dryRun: boolean;
  email: string;
  name: string;
  role: string;
  status: string;
}

function printUsage() {
  console.log(`
Usage:
  npm run db:provision-user -- --auth0-user-id=<auth0|subject> --email=<user@example.com> --name="Full Name" --role=super_admin [--status=active] [--avatar-url=<https://...>] [--dry-run]

Required flags:
  --auth0-user-id   The exact Auth0 user subject stored in the session, for example auth0|abc123
  --email           Email address to persist in the MongoDB users collection
  --name            Display name to persist in the MongoDB users collection
  --role            Application role stored in MongoDB, for example super_admin

Optional flags:
  --status          Account status. Defaults to active.
  --avatar-url      Optional avatar URL stored in the users collection.
  --dry-run         Validate input and show the intended database operation without writing.
  --help            Show this message.

Notes:
  - Create the Auth0 user manually first. This script only provisions the application user record in MongoDB.
  - Do not assign Auth0 RBAC roles. Application authorization stays in the MongoDB users collection.
`);
}

function normalizeOptionName(input: string) {
  return input
    .trim()
    .replace(/^--/, "")
    .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function parseCliArgs(argv: string[]) {
  const options: RawCliOptions = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token?.startsWith("--")) {
      continue;
    }

    const [rawKey, inlineValue] = token.split("=", 2);
    const key = normalizeOptionName(rawKey);

    if (inlineValue !== undefined) {
      options[key] = inlineValue;
      continue;
    }

    const nextToken = argv[index + 1];

    if (nextToken && !nextToken.startsWith("--")) {
      options[key] = nextToken;
      index += 1;
      continue;
    }

    options[key] = true;
  }

  return options;
}

function readRequiredStringOption(options: RawCliOptions, key: string) {
  const value = options[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required flag --${key}. Run with --help for usage.`);
  }

  return value.trim();
}

function readOptionalStringOption(options: RawCliOptions, key: string) {
  const value = options[key];

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function resolveCliOptions(argv: string[]): ProvisionCliOptions | null {
  const options = parseCliArgs(argv);

  if (options.help === true || options.h === true) {
    printUsage();
    return null;
  }

  return {
    auth0UserId: readRequiredStringOption(options, "auth0-user-id"),
    avatarUrl: readOptionalStringOption(options, "avatar-url"),
    dryRun: options["dry-run"] === true,
    email: readRequiredStringOption(options, "email"),
    name: readRequiredStringOption(options, "name"),
    role: readRequiredStringOption(options, "role"),
    status: readOptionalStringOption(options, "status") ?? "active",
  };
}

function removeUndefinedFields<TValue extends Record<string, unknown>>(value: TValue) {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
  ) as TValue;
}

async function getDbApi() {
  const [
    clientModule,
    collectionsModule,
    initModule,
    modelModule,
    appUserModelModule,
  ] = await Promise.all([
    import("@/lib/db/core/client"),
    import("@/lib/db/core/collections"),
    import("@/lib/db/core/init"),
    import("@/lib/db/models"),
    import("@/lib/auth/app-user-model"),
  ]);

  return {
    ...clientModule,
    ...collectionsModule,
    ...initModule,
    ...modelModule,
    ...appUserModelModule,
  };
}

async function main() {
  const cliOptions = resolveCliOptions(process.argv.slice(2));

  if (!cliOptions) {
    return;
  }

  const {
    AppUserRoleSchema,
    AppUserStatusSchema,
    CreateUserInputSchema,
    getMongoClient,
    getMongoDatabaseName,
    getUsersCollection,
    initializeDatabase,
  } = await getDbApi();

  const parsedInput = CreateUserInputSchema.parse({
    auth0UserId: cliOptions.auth0UserId,
    avatarUrl: cliOptions.avatarUrl,
    email: cliOptions.email,
    name: cliOptions.name,
    role: AppUserRoleSchema.parse(cliOptions.role),
    status: AppUserStatusSchema.parse(cliOptions.status),
  });

  const client = await getMongoClient();

  try {
    const initialization = await initializeDatabase();
    const usersCollection = await getUsersCollection();
    const existingUser = await usersCollection.findOne({
      auth0UserId: parsedInput.auth0UserId,
    });
    const operationLabel = existingUser ? "update" : "create";

    console.log(
      `Database ready for ${initialization.databaseName}. Preparing to ${operationLabel} app user ${parsedInput.auth0UserId} in ${getMongoDatabaseName()}.`,
    );

    if (cliOptions.dryRun) {
      console.log("Dry run only. No database write was performed.");
      console.log(JSON.stringify(parsedInput, null, 2));
      return;
    }

    const now = new Date();

    const result = await usersCollection.findOneAndUpdate(
      { auth0UserId: parsedInput.auth0UserId },
      {
        $set: {
          ...removeUndefinedFields(parsedInput),
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    if (!result?._id) {
      throw new Error(`Failed to ${operationLabel} app user ${parsedInput.auth0UserId}.`);
    }

    console.log(
      `${operationLabel === "create" ? "Created" : "Updated"} app user ${parsedInput.name} <${parsedInput.email}> with role ${parsedInput.role} and status ${parsedInput.status}.`,
    );
    console.log(
      `MongoDB record id: ${result._id.toString()}. Auth0 identity remains external and must already exist with subject ${parsedInput.auth0UserId}.`,
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Provisioning failed:", error);
  process.exitCode = 1;
});