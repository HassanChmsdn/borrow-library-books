import "server-only";

import { ObjectId } from "mongodb";

import {
  CreateBookCopyInputSchema,
  UpdateBookCopyInputSchema,
  getBookCopiesCollection,
  getBooksCollection,
  getBorrowRequestsCollection,
  isMongoConfigured,
  type BookCopyStatus,
} from "@/lib/db";

export interface SaveAdminInventoryCopyInput {
  bookId: string;
  condition: "fair" | "good" | "new" | "poor";
  copyCode: string;
  copyId?: string;
  status: "available" | "borrowed" | "maintenance";
}

export interface SavedAdminInventoryCopyRecord {
  copyCode: string;
  id: string;
}

function toDatabaseId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : id;
}

async function assertBookExists(bookId: string) {
  const books = await getBooksCollection();
  const book = await books.findOne({ _id: toDatabaseId(bookId) });

  if (!book?._id) {
    throw new Error("The selected book could not be found.");
  }

  return book;
}

async function assertUniqueCopyCode(copyCode: string, copyId?: string) {
  const bookCopies = await getBookCopiesCollection();
  const existingCopy = await bookCopies.findOne({ copyCode });

  if (!existingCopy?._id) {
    return;
  }

  if (copyId && existingCopy._id.toString() === copyId) {
    return;
  }

  throw new Error("Another inventory copy already uses that copy code.");
}

async function countOpenBorrowingsForCopy(copyId: string) {
  const borrowRequests = await getBorrowRequestsCollection();

  return borrowRequests.countDocuments({
    bookCopyId: { $in: [toDatabaseId(copyId), copyId] },
    status: { $in: ["pending", "active", "overdue"] },
  });
}

function toBookCopyStatus(
  status: SaveAdminInventoryCopyInput["status"],
): BookCopyStatus {
  return status;
}

export async function saveAdminInventoryCopy(
  input: SaveAdminInventoryCopyInput,
) {
  if (!isMongoConfigured()) {
    throw new Error("Inventory management requires MongoDB to be configured.");
  }

  const copyCode = input.copyCode.trim();
  await Promise.all([
    assertBookExists(input.bookId),
    assertUniqueCopyCode(copyCode, input.copyId),
  ]);

  if (!input.copyId && input.status === "borrowed") {
    throw new Error(
      "New copies cannot start as borrowed. Create the copy as available or maintenance, then attach borrowing activity through the borrowing workflow.",
    );
  }

  const bookCopies = await getBookCopiesCollection();
  const now = new Date();
  const payload = {
    bookId: toDatabaseId(input.bookId),
    condition: input.condition,
    copyCode,
    status: toBookCopyStatus(input.status),
  };

  if (!input.copyId) {
    const parsed = CreateBookCopyInputSchema.parse(payload);
    const result = await bookCopies.insertOne({
      ...parsed,
      createdAt: now,
      updatedAt: now,
    });

    return {
      copyCode: parsed.copyCode,
      id: result.insertedId.toString(),
    } satisfies SavedAdminInventoryCopyRecord;
  }

  const currentCopy = await bookCopies.findOne({
    _id: toDatabaseId(input.copyId),
  });

  if (!currentCopy?._id) {
    throw new Error("The selected inventory copy could not be found.");
  }

  const openBorrowingCount = await countOpenBorrowingsForCopy(input.copyId);

  if (
    openBorrowingCount > 0 &&
    (String(currentCopy.bookId) !== input.bookId ||
      input.status === "available" ||
      input.status === "maintenance")
  ) {
    throw new Error(
      "Copies attached to open borrowing records must be released through borrowing management before changing their book or availability status.",
    );
  }

  const parsed = UpdateBookCopyInputSchema.parse(payload);
  const result = await bookCopies.findOneAndUpdate(
    { _id: currentCopy._id },
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
    throw new Error("The selected inventory copy could not be found.");
  }

  return {
    copyCode: result.copyCode,
    id: result._id.toString(),
  } satisfies SavedAdminInventoryCopyRecord;
}
