import type { CreateCollectionOptions, Document, IndexDescription } from "mongodb";

import { APP_USER_ROLE_VALUES } from "../../auth/app-user-model";
import { COLLECTIONS, type CollectionName } from "./collections";
import { getMongoClient, getMongoDatabaseName } from "./client";

type CollectionValidationConfig = Pick<
  CreateCollectionOptions,
  "validationAction" | "validationLevel" | "validator"
>;

interface CollectionInitDefinition {
  indexes: IndexDescription[];
  validation?: CollectionValidationConfig;
}

export interface DatabaseInitializationResult {
  databaseName: string;
  initializedCollections: CollectionName[];
  ensuredIndexes: string[];
  appliedValidators: CollectionName[];
}

function baseDocumentProperties() {
  return {
    createdAt: { bsonType: "date" },
    updatedAt: { bsonType: "date" },
  };
}

const collectionDefinitions: Record<CollectionName, CollectionInitDefinition> = {
  [COLLECTIONS.users]: {
    indexes: [
      {
        key: { auth0UserId: 1 },
        name: "users_auth0UserId_unique",
        unique: true,
      },
      {
        key: { email: 1 },
        name: "users_email_unique",
        unique: true,
        partialFilterExpression: { email: { $type: "string" } },
      },
      {
        key: { role: 1, status: 1 },
        name: "users_role_status_lookup",
      },
    ],
    validation: {
      validationAction: "warn",
      validationLevel: "moderate",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["auth0UserId", "email", "name", "role", "status"],
          properties: {
            ...baseDocumentProperties(),
            auth0UserId: { bsonType: "string" },
            avatarUrl: { bsonType: "string" },
            email: { bsonType: "string" },
            lastLoginAt: { bsonType: "date" },
            name: { bsonType: "string" },
            role: { enum: [...APP_USER_ROLE_VALUES] },
            status: { enum: ["active", "suspended"] },
          },
        },
      },
    },
  },
  [COLLECTIONS.categories]: {
    indexes: [
      {
        key: { name: 1 },
        name: "categories_name_unique",
        unique: true,
      },
      {
        key: { slug: 1 },
        name: "categories_slug_unique",
        unique: true,
      },
    ],
    validation: {
      validationAction: "warn",
      validationLevel: "moderate",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "slug"],
          properties: {
            ...baseDocumentProperties(),
            description: { bsonType: "string" },
            name: { bsonType: "string" },
            slug: { bsonType: "string" },
          },
        },
      },
    },
  },
  [COLLECTIONS.books]: {
    indexes: [
      {
        key: { isbn: 1 },
        name: "books_isbn_unique",
        unique: true,
        partialFilterExpression: { isbn: { $type: "string" } },
      },
      {
        key: { categoryId: 1, status: 1 },
        name: "books_category_status_lookup",
      },
      {
        key: { title: 1, author: 1 },
        name: "books_title_author_lookup",
      },
    ],
    validation: {
      validationAction: "warn",
      validationLevel: "moderate",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "allowCustomDuration",
            "author",
            "categoryId",
            "description",
            "feeCents",
            "isbn",
            "predefinedDurations",
            "status",
            "title",
          ],
          properties: {
            ...baseDocumentProperties(),
            allowCustomDuration: { bsonType: "bool" },
            author: { bsonType: "string" },
            categoryId: { bsonType: ["objectId", "string"] },
            coverImageUrl: { bsonType: "string" },
            description: { bsonType: "string" },
            feeCents: { bsonType: ["int", "long", "double", "decimal"] },
            isbn: { bsonType: "string" },
            metadata: { bsonType: "object" },
            predefinedDurations: {
              bsonType: "array",
              items: { bsonType: ["int", "long", "double", "decimal"] },
            },
            status: { enum: ["active", "inactive"] },
            title: { bsonType: "string" },
          },
        },
      },
    },
  },
  [COLLECTIONS.bookCopies]: {
    indexes: [
      {
        key: { copyCode: 1 },
        name: "bookCopies_copyCode_unique",
        unique: true,
      },
      {
        key: { bookId: 1, status: 1 },
        name: "bookCopies_book_status_lookup",
      },
      {
        key: { status: 1, condition: 1 },
        name: "bookCopies_status_condition_lookup",
      },
    ],
    validation: {
      validationAction: "warn",
      validationLevel: "moderate",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["bookId", "condition", "copyCode", "status"],
          properties: {
            ...baseDocumentProperties(),
            bookId: { bsonType: ["objectId", "string"] },
            condition: { enum: ["new", "good", "fair", "poor"] },
            copyCode: { bsonType: "string" },
            notes: { bsonType: "string" },
            status: {
              enum: ["available", "reserved", "borrowed", "maintenance"],
            },
          },
        },
      },
    },
  },
  [COLLECTIONS.borrowRequests]: {
    indexes: [
      {
        key: { userId: 1, status: 1, requestedAt: -1 },
        name: "borrowRequests_user_status_requestedAt",
      },
      {
        key: { bookCopyId: 1, status: 1 },
        name: "borrowRequests_copy_status_lookup",
      },
      {
        key: { status: 1, requestedAt: -1 },
        name: "borrowRequests_status_requestedAt",
      },
      {
        key: { bookId: 1 },
        name: "borrowRequests_book_lookup",
      },
    ],
    validation: {
      validationAction: "warn",
      validationLevel: "moderate",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "bookCopyId",
            "bookId",
            "durationType",
            "feeCents",
            "paymentMethod",
            "paymentStatus",
            "requestedAt",
            "requestedDurationDays",
            "status",
            "userId",
          ],
          properties: {
            ...baseDocumentProperties(),
            approvedDurationDays: {
              bsonType: ["int", "long", "double", "decimal"],
            },
            bookCopyId: { bsonType: ["objectId", "string"] },
            bookId: { bsonType: ["objectId", "string"] },
            cancelledAt: { bsonType: "date" },
            dueAt: { bsonType: "date" },
            durationType: { enum: ["predefined", "custom"] },
            feeCents: { bsonType: ["int", "long", "double", "decimal"] },
            notes: { bsonType: "string" },
            paymentMethod: { enum: ["onsite-cash"] },
            paymentStatus: { enum: ["unpaid", "pending", "paid", "waived"] },
            rejectionReason: { bsonType: "string" },
            requestedAt: { bsonType: "date" },
            requestedDurationDays: {
              bsonType: ["int", "long", "double", "decimal"],
            },
            returnedAt: { bsonType: "date" },
            reviewedAt: { bsonType: "date" },
            reviewedByUserId: { bsonType: ["objectId", "string"] },
            startedAt: { bsonType: "date" },
            status: {
              enum: ["draft", "pending", "active", "overdue", "returned", "cancelled"],
            },
            userId: { bsonType: ["objectId", "string"] },
          },
        },
      },
    },
  },
};

async function getDatabase() {
  const client = await getMongoClient();

  return client.db(getMongoDatabaseName());
}

async function ensureCollectionExists(name: CollectionName) {
  const db = await getDatabase();
  const existingCollections = await db
    .listCollections({ name }, { nameOnly: true })
    .toArray();

  if (existingCollections.length > 0) {
    return;
  }

  const definition = collectionDefinitions[name];

  await db.createCollection(name, definition.validation);
}

async function applyCollectionValidation(name: CollectionName) {
  const db = await getDatabase();
  const definition = collectionDefinitions[name];

  if (!definition.validation) {
    return false;
  }

  await db.command({
    collMod: name,
    validationAction: definition.validation.validationAction,
    validationLevel: definition.validation.validationLevel,
    validator: definition.validation.validator,
  });

  return true;
}

async function ensureCollectionIndexes(name: CollectionName) {
  const db = await getDatabase();
  const collection = db.collection<Document>(name);
  const definition = collectionDefinitions[name];

  if (definition.indexes.length === 0) {
    return [] as string[];
  }

  return collection.createIndexes(definition.indexes);
}

export async function initializeDatabase(): Promise<DatabaseInitializationResult> {
  const databaseName = getMongoDatabaseName();
  const initializedCollections: CollectionName[] = [];
  const appliedValidators: CollectionName[] = [];
  const ensuredIndexes: string[] = [];

  for (const collectionName of Object.values(COLLECTIONS)) {
    await ensureCollectionExists(collectionName);
    initializedCollections.push(collectionName);

    const validatorApplied = await applyCollectionValidation(collectionName);

    if (validatorApplied) {
      appliedValidators.push(collectionName);
    }

    const indexNames = await ensureCollectionIndexes(collectionName);
    ensuredIndexes.push(...indexNames);
  }

  return {
    appliedValidators,
    databaseName,
    ensuredIndexes,
    initializedCollections,
  };
}