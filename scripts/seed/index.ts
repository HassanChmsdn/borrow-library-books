import { loadEnvConfig } from "@next/env";

import type { DatabaseId } from "@/lib/db";

import {
  seedBookCopies,
  seedBooks,
  seedBorrowRequests,
  seedCategories,
  seedUsers,
  type SeedUser,
} from "./data";

type IdMap = Map<string, DatabaseId>;

loadEnvConfig(process.cwd());

async function getDbApi() {
  const [clientModule, collectionsModule, initModule, modelsModule] = await Promise.all([
    import("@/lib/db/core/client"),
    import("@/lib/db/core/collections"),
    import("@/lib/db/core/init"),
    import("@/lib/db/models"),
  ]);

  return {
    ...clientModule,
    ...collectionsModule,
    ...initModule,
    ...modelsModule,
  };
}

function hasResetFlag() {
  return process.argv.includes("--reset");
}

function timestamped<T extends Record<string, unknown>>(input: T) {
  const now = new Date();

  return {
    ...input,
    createdAt: now,
    updatedAt: now,
  };
}

async function clearCollections() {
  const {
    getBorrowRequestsCollection,
    getBookCopiesCollection,
    getBooksCollection,
    getCategoriesCollection,
    getUsersCollection,
  } = await getDbApi();

  const [borrowRequests, bookCopies, books, categories, users] = await Promise.all([
    getBorrowRequestsCollection(),
    getBookCopiesCollection(),
    getBooksCollection(),
    getCategoriesCollection(),
    getUsersCollection(),
  ]);

  await Promise.all([
    borrowRequests.deleteMany({}),
    bookCopies.deleteMany({}),
    books.deleteMany({}),
    categories.deleteMany({}),
    users.deleteMany({}),
  ]);
}

async function seedCategoryDocuments(reset: boolean) {
  const { CreateCategoryInputSchema, getCategoriesCollection } = await getDbApi();
  const categoriesCollection = await getCategoriesCollection();
  const categoryIds: IdMap = new Map();

  for (const category of seedCategories) {
    const parsed = CreateCategoryInputSchema.parse({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });

    if (reset) {
      const result = await categoriesCollection.insertOne(timestamped(parsed));
      categoryIds.set(category.key, result.insertedId);
      continue;
    }

    const result = await categoriesCollection.findOneAndUpdate(
      { slug: parsed.slug },
      {
        $set: {
          ...parsed,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    if (!result?._id) {
      throw new Error(`Failed to upsert category: ${category.slug}`);
    }

    categoryIds.set(category.key, result._id);
  }

  return categoryIds;
}

async function seedBookDocuments(categoryIds: IdMap, reset: boolean) {
  const { CreateBookInputSchema, getBooksCollection } = await getDbApi();
  const booksCollection = await getBooksCollection();
  const bookIds: IdMap = new Map();

  for (const book of seedBooks) {
    const categoryId = categoryIds.get(book.categoryKey);

    if (!categoryId) {
      throw new Error(`Missing category id for book seed: ${book.key}`);
    }

    const parsed = CreateBookInputSchema.parse({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description,
      categoryId,
      feeCents: book.feeCents,
      allowCustomDuration: book.allowCustomDuration,
      predefinedDurations: book.predefinedDurations,
      status: book.status,
      metadata: book.metadata,
      coverImageUrl: book.coverImageUrl,
    });

    if (reset) {
      const result = await booksCollection.insertOne(timestamped(parsed));
      bookIds.set(book.key, result.insertedId);
      continue;
    }

    const result = await booksCollection.findOneAndUpdate(
      { isbn: parsed.isbn },
      {
        $set: {
          ...parsed,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    if (!result?._id) {
      throw new Error(`Failed to upsert book: ${book.isbn}`);
    }

    bookIds.set(book.key, result._id);
  }

  return bookIds;
}

async function seedBookCopyDocuments(bookIds: IdMap, reset: boolean) {
  const { CreateBookCopyInputSchema, getBookCopiesCollection } = await getDbApi();
  const bookCopiesCollection = await getBookCopiesCollection();
  const copyIds: IdMap = new Map();

  for (const bookCopy of seedBookCopies) {
    const bookId = bookIds.get(bookCopy.bookKey);

    if (!bookId) {
      throw new Error(`Missing book id for copy seed: ${bookCopy.key}`);
    }

    const parsed = CreateBookCopyInputSchema.parse({
      bookId,
      copyCode: bookCopy.copyCode,
      condition: bookCopy.condition,
      status: bookCopy.status,
      notes: bookCopy.notes,
    });

    if (reset) {
      const result = await bookCopiesCollection.insertOne(timestamped(parsed));
      copyIds.set(bookCopy.key, result.insertedId);
      continue;
    }

    const result = await bookCopiesCollection.findOneAndUpdate(
      { copyCode: parsed.copyCode },
      {
        $set: {
          ...parsed,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    if (!result?._id) {
      throw new Error(`Failed to upsert book copy: ${bookCopy.copyCode}`);
    }

    copyIds.set(bookCopy.key, result._id);
  }

  return copyIds;
}

async function seedBorrowRequestDocuments({
  bookIds,
  copyIds,
  reset,
  userIds,
}: {
  bookIds: IdMap;
  copyIds: IdMap;
  reset: boolean;
  userIds: IdMap;
}) {
  const {
    CreateBorrowRequestInputSchema,
    UpdateBorrowRequestInputSchema,
    getBorrowRequestsCollection,
  } = await getDbApi();
  const borrowRequestsCollection = await getBorrowRequestsCollection();

  for (const borrowRequest of seedBorrowRequests) {
    const bookId = bookIds.get(borrowRequest.bookKey);
    const bookCopyId = copyIds.get(borrowRequest.bookCopyKey);
    const userId = userIds.get(borrowRequest.userKey);
    const reviewedByUserId = borrowRequest.reviewedByUserKey
      ? userIds.get(borrowRequest.reviewedByUserKey)
      : undefined;

    if (!bookId) {
      throw new Error(`Missing book id for borrow request seed: ${borrowRequest.key}`);
    }

    if (!bookCopyId) {
      throw new Error(`Missing copy id for borrow request seed: ${borrowRequest.key}`);
    }

    if (!userId) {
      throw new Error(`Missing user id for borrow request seed: ${borrowRequest.key}`);
    }

    if (borrowRequest.reviewedByUserKey && !reviewedByUserId) {
      throw new Error(`Missing reviewer id for borrow request seed: ${borrowRequest.key}`);
    }

    const requestedAt = new Date(
      Date.now() - borrowRequest.requestedDaysAgo * 24 * 60 * 60 * 1000,
    );
    const startedAt =
      borrowRequest.startedDaysAgo !== undefined
        ? new Date(Date.now() - borrowRequest.startedDaysAgo * 24 * 60 * 60 * 1000)
        : undefined;
    const approvedDurationDays =
      borrowRequest.approvedDurationDays ?? borrowRequest.requestedDurationDays;
    const dueAt = startedAt
      ? new Date(startedAt.getTime() + approvedDurationDays * 24 * 60 * 60 * 1000)
      : undefined;
    const parsed = CreateBorrowRequestInputSchema.parse({
      bookCopyId,
      bookId,
      durationType: borrowRequest.durationType,
      feeCents: borrowRequest.feeCents,
      notes: borrowRequest.notes,
      paymentMethod: borrowRequest.paymentMethod,
      paymentStatus: borrowRequest.paymentStatus,
      requestedAt,
      requestedDurationDays: borrowRequest.requestedDurationDays,
      status: borrowRequest.status,
      userId,
    });
    const lifecycleFields = UpdateBorrowRequestInputSchema.parse(
      borrowRequest.status === "active"
        ? {
            approvedDurationDays,
            dueAt,
            reviewedAt: startedAt,
            reviewedByUserId,
            startedAt,
            status: "active",
          }
        : {
            status: "pending",
          },
    );

    if (reset) {
      await borrowRequestsCollection.insertOne(
        timestamped({
          ...parsed,
          ...lifecycleFields,
          requestedAt,
        }),
      );
      continue;
    }

    await borrowRequestsCollection.updateOne(
      {
        notes: parsed.notes,
      },
      {
        $set: {
          ...parsed,
          ...lifecycleFields,
          requestedAt,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
      },
    );
  }
}

async function reconcileBookCopyStatuses() {
  const {
    UpdateBookCopyInputSchema,
    getBookCopiesCollection,
    getBorrowRequestsCollection,
  } = await getDbApi();
  const [bookCopiesCollection, borrowRequestsCollection] = await Promise.all([
    getBookCopiesCollection(),
    getBorrowRequestsCollection(),
  ]);
  const [copies, borrowRequests] = await Promise.all([
    bookCopiesCollection
      .find({}, { projection: { _id: 1, status: 1 } })
      .toArray(),
    borrowRequestsCollection
      .find({}, { projection: { bookCopyId: 1, status: 1 } })
      .toArray(),
  ]);
  const requestDrivenStatusByCopyId = new Map<string, "borrowed" | "reserved">();
  let repairedCopies = 0;

  for (const borrowRequest of borrowRequests) {
    const copyId = String(borrowRequest.bookCopyId);

    if (borrowRequest.status === "active" || borrowRequest.status === "overdue") {
      requestDrivenStatusByCopyId.set(copyId, "borrowed");
      continue;
    }

    if (
      borrowRequest.status === "pending" &&
      requestDrivenStatusByCopyId.get(copyId) !== "borrowed"
    ) {
      requestDrivenStatusByCopyId.set(copyId, "reserved");
    }
  }

  for (const copy of copies) {
    const requestDrivenStatus = requestDrivenStatusByCopyId.get(String(copy._id));
    const nextStatus = requestDrivenStatus
      ? requestDrivenStatus
      : copy.status === "maintenance"
        ? "maintenance"
        : "available";

    if (nextStatus === copy.status) {
      continue;
    }

    const parsed = UpdateBookCopyInputSchema.parse({
      status: nextStatus,
    });

    await bookCopiesCollection.updateOne(
      { _id: copy._id },
      {
        $set: {
          ...parsed,
          updatedAt: new Date(),
        },
      },
    );
    repairedCopies += 1;
  }

  return repairedCopies;
}

async function seedUserDocuments(reset: boolean) {
  const { CreateUserInputSchema, getUsersCollection } = await getDbApi();
  const usersCollection = await getUsersCollection();
  const bootstrapAdmins: SeedUser[] = [];
  const userIds: IdMap = new Map();

  for (const user of seedUsers) {
    const parsed = CreateUserInputSchema.parse({
      auth0UserId: user.auth0UserId,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
    });

    if (user.bootstrapAdmin) {
      bootstrapAdmins.push(user);
    }

    if (reset) {
      const result = await usersCollection.insertOne(timestamped(parsed));
      userIds.set(user.key, result.insertedId);
      continue;
    }

    const result = await usersCollection.findOneAndUpdate(
      { auth0UserId: parsed.auth0UserId },
      {
        $set: {
          ...parsed,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    if (!result?._id) {
      throw new Error(`Failed to upsert user: ${parsed.auth0UserId}`);
    }

    userIds.set(user.key, result._id);
  }

  return {
    bootstrapAdmins,
    userIds,
  };
}

async function seedDevelopmentData({ reset }: { reset: boolean }) {
  if (reset) {
    await clearCollections();
  }

  const { bootstrapAdmins, userIds } = await seedUserDocuments(reset);
  const categoryIds = await seedCategoryDocuments(reset);
  const bookIds = await seedBookDocuments(categoryIds, reset);
  const copyIds = await seedBookCopyDocuments(bookIds, reset);
  await seedBorrowRequestDocuments({ bookIds, copyIds, reset, userIds });
  const repairedCopies = await reconcileBookCopyStatuses();

  return {
    bootstrapAdmins,
    repairedCopies,
    seededBooks: seedBooks.length,
    seededBorrowRequests: seedBorrowRequests.length,
    seededCategories: seedCategories.length,
    seededCopies: seedBookCopies.length,
    seededUsers: seedUsers.length,
  };
}

async function main() {
  const { COLLECTIONS, getMongoClient, initializeDatabase } = await getDbApi();
  const reset = hasResetFlag();
  const modeLabel = reset ? "reset + reseed" : "seed/upsert";

  console.log(
    `Starting development data ${modeLabel} for ${COLLECTIONS.users} and related collections...`,
  );

  const client = await getMongoClient();

  try {
    const initialization = await initializeDatabase();

    console.log(
      `Database initialized: ${initialization.initializedCollections.length} collections, ${initialization.ensuredIndexes.length} indexes ensured.`,
    );

    const summary = await seedDevelopmentData({ reset });

    console.log(
      `Seed complete: ${summary.seededCategories} categories, ${summary.seededBooks} books, ${summary.seededCopies} copies, ${summary.seededBorrowRequests} borrow requests, ${summary.seededUsers} users.`,
    );

    if (summary.repairedCopies > 0) {
      console.log(`Reconciled ${summary.repairedCopies} copy statuses from live borrow request state.`);
    }

    for (const admin of summary.bootstrapAdmins) {
      console.log(
        `Bootstrap admin seeded intentionally for local development: ${admin.name} <${admin.email}> (${admin.auth0UserId})`,
      );
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});