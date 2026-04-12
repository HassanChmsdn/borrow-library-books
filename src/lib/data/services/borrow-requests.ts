import "server-only";

import {
  CreateBorrowRequestInputSchema,
  getBorrowRequestsCollection,
  isMongoConfigured,
  type BorrowDurationType,
  type PaymentStatus,
} from "@/lib/db";
import {
  getStoredBookCopyRecordById,
  getStoredBookRecordById,
  listStoredBookCopyRecordsForBook,
} from "@/lib/data/server";

export interface CreatedBorrowRequestRecord {
  bookCopyId: string;
  bookId: string;
  durationType: BorrowDurationType;
  feeCents: number;
  id: string;
  paymentStatus: PaymentStatus;
  requestedAt: string;
  requestedDurationDays: number;
  status: "pending";
  userId: string;
}

interface CreateBorrowRequestForUserInput {
  bookCopyId?: string;
  bookId: string;
  durationType: BorrowDurationType;
  paymentStatus?: PaymentStatus;
  requestedDurationDays: number;
  userId: string;
}

async function listReservedCopyIds(bookId: string) {
  if (!isMongoConfigured()) {
    return new Set<string>();
  }

  const borrowRequests = await getBorrowRequestsCollection();
  const reserved = await borrowRequests
    .find(
      {
        bookId,
        status: { $in: ["pending", "active", "overdue"] },
      },
      {
        projection: {
          bookCopyId: 1,
        },
      },
    )
    .toArray();

  return new Set(
    reserved
      .map((record) => String(record.bookCopyId))
      .filter((value) => value.length > 0),
  );
}

export async function createBorrowRequestForUser(
  input: CreateBorrowRequestForUserInput,
) {
  if (!isMongoConfigured()) {
    throw new Error(
      "Borrow request creation requires MongoDB to be configured.",
    );
  }

  const book = await getStoredBookRecordById(input.bookId);

  if (!book) {
    throw new Error("The selected book could not be found.");
  }

  const reservedCopyIds = await listReservedCopyIds(input.bookId);
  const availableCopies = (await listStoredBookCopyRecordsForBook(input.bookId))
    .filter(
      (copy) =>
        copy.status === "available" && !reservedCopyIds.has(copy.id),
    )
    .sort((left, right) => left.copyCode.localeCompare(right.copyCode));

  const copy = input.bookCopyId
    ? await getStoredBookCopyRecordById(input.bookCopyId)
    : availableCopies[0] ?? null;

  if (!copy || copy.bookId !== input.bookId) {
    throw new Error("No available physical copy could be assigned to this request.");
  }

  if (copy.status !== "available" || reservedCopyIds.has(copy.id)) {
    throw new Error("No available physical copy could be assigned to this request.");
  }

  if (input.durationType === "custom" && !book.allowCustomDuration) {
    throw new Error("Custom duration requests are not allowed for this title.");
  }

  if (
    input.durationType === "predefined" &&
    !book.predefinedDurations.includes(
      input.requestedDurationDays as (typeof book.predefinedDurations)[number],
    )
  ) {
    throw new Error("Choose one of the predefined duration options.");
  }

  const requestedAt = new Date();
  const parsed = CreateBorrowRequestInputSchema.parse({
    bookCopyId: copy.id,
    bookId: input.bookId,
    durationType: input.durationType,
    feeCents: book.feeCents,
    paymentMethod: "onsite-cash",
    paymentStatus: input.paymentStatus ?? "unpaid",
    requestedAt,
    requestedDurationDays: input.requestedDurationDays,
    status: "pending",
    userId: input.userId,
  });

  const borrowRequests = await getBorrowRequestsCollection();
  const result = await borrowRequests.insertOne({
    ...parsed,
    createdAt: requestedAt,
    requestedAt,
    updatedAt: requestedAt,
  });

  return {
    bookCopyId: copy.id,
    bookId: input.bookId,
    durationType: input.durationType,
    feeCents: book.feeCents,
    id: result.insertedId.toString(),
    paymentStatus: parsed.paymentStatus,
    requestedAt: requestedAt.toISOString(),
    requestedDurationDays: input.requestedDurationDays,
    status: "pending",
    userId: input.userId,
  } satisfies CreatedBorrowRequestRecord;
}