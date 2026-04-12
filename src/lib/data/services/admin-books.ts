import "server-only";

import { ObjectId } from "mongodb";

import {
  CreateBookInputSchema,
  UpdateBookInputSchema,
  getBookCopiesCollection,
  getBooksCollection,
  getBorrowRequestsCollection,
  getCategoriesCollection,
  isMongoConfigured,
} from "@/lib/db";

export interface SaveAdminBookInput {
  allowCustomDuration: boolean;
  author: string;
  bookId?: string;
  categoryLabel: string;
  coverImageFileName?: string;
  description: string;
  feeCents: number;
  isbn: string;
  metadata: {
    edition: string;
    language: string;
    publishedYear: string;
    publisher: string;
  };
  predefinedDurations: ReadonlyArray<number>;
  status: "active" | "inactive";
  title: string;
}

export interface SavedAdminBookRecord {
  id: string;
  title: string;
}

function toDatabaseId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : id;
}

function normalizeCategoryName(label: string) {
  if (label === "Art & Design") {
    return "Design";
  }

  if (label === "Fiction") {
    return "Literature";
  }

  return label;
}

function buildCoverImageUrl(fileName?: string) {
  const normalizedFileName = fileName?.trim();

  if (!normalizedFileName) {
    return undefined;
  }

  return `https://assets.library.test/covers/${encodeURIComponent(normalizedFileName)}`;
}

async function resolveCategoryId(categoryLabel: string) {
  const categories = await getCategoriesCollection();
  const normalizedCategoryName = normalizeCategoryName(categoryLabel);
  const category = await categories.findOne({ name: normalizedCategoryName });

  if (!category?._id) {
    throw new Error("The selected category could not be found.");
  }

  return category._id;
}

async function assertUniqueIsbn(isbn: string, bookId?: string) {
  const books = await getBooksCollection();
  const existingBook = await books.findOne({ isbn });

  if (!existingBook) {
    return;
  }

  if (bookId && existingBook._id.toString() === bookId) {
    return;
  }

  throw new Error("Another book already uses this ISBN.");
}

export async function saveAdminBook(input: SaveAdminBookInput) {
  if (!isMongoConfigured()) {
    throw new Error("Admin book management requires MongoDB to be configured.");
  }

  const normalizedIsbn = input.isbn.trim();
  await assertUniqueIsbn(normalizedIsbn, input.bookId);

  const [books, categoryId] = await Promise.all([
    getBooksCollection(),
    resolveCategoryId(input.categoryLabel),
  ]);

  const now = new Date();
  const payload = {
    allowCustomDuration: input.allowCustomDuration,
    author: input.author.trim(),
    categoryId,
    coverImageUrl: buildCoverImageUrl(input.coverImageFileName),
    description: input.description.trim(),
    feeCents: input.feeCents,
    isbn: normalizedIsbn,
    metadata: {
      edition: input.metadata.edition.trim(),
      language: input.metadata.language.trim(),
      publishedYear: input.metadata.publishedYear.trim(),
      publisher: input.metadata.publisher.trim(),
    },
    predefinedDurations: [...new Set(input.predefinedDurations)].sort(
      (left, right) => left - right,
    ),
    status: input.status,
    title: input.title.trim(),
  };

  if (!input.bookId) {
    const parsed = CreateBookInputSchema.parse(payload);
    const result = await books.insertOne({
      ...parsed,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: result.insertedId.toString(),
      title: parsed.title,
    } satisfies SavedAdminBookRecord;
  }

  const parsed = UpdateBookInputSchema.parse(payload);
  const result = await books.findOneAndUpdate(
    { _id: toDatabaseId(input.bookId) },
    {
      $set: {
        ...parsed,
        updatedAt: now,
      },
    },
    {
      returnDocument: "after",
    },
  );

  if (!result?._id) {
    throw new Error("The selected book could not be found.");
  }

  return {
    id: result._id.toString(),
    title: result.title,
  } satisfies SavedAdminBookRecord;
}

export async function deleteAdminBook(bookId: string) {
  if (!isMongoConfigured()) {
    throw new Error("Admin book management requires MongoDB to be configured.");
  }

  const selector = { _id: toDatabaseId(bookId) };
  const [books, bookCopies, borrowRequests] = await Promise.all([
    getBooksCollection(),
    getBookCopiesCollection(),
    getBorrowRequestsCollection(),
  ]);
  const book = await books.findOne(selector);

  if (!book?._id) {
    throw new Error("The selected book could not be found.");
  }

  const borrowRequestCount = await borrowRequests.countDocuments({
    bookId: book._id,
  });

  if (borrowRequestCount > 0) {
    throw new Error(
      "Books with borrowing history cannot be deleted. Archive the title instead if it should stay unavailable.",
    );
  }

  await bookCopies.deleteMany({ bookId: book._id });
  await books.deleteOne(selector);

  return {
    id: book._id.toString(),
    title: book.title,
  } satisfies SavedAdminBookRecord;
}