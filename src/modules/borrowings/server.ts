import "server-only";

import {
  getBorrowRequestsCollection,
  isMongoConfigured,
  type BorrowRequestDocument,
} from "@/lib/db";
import { getAllBooksItemById } from "@/modules/catalog/all-books-data";

import {
  createPendingBorrowingRecord,
  type BorrowingPaymentStatus,
  type BorrowingRecord,
} from "./data";

function formatBorrowingShortDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function buildPaymentStatus(record: BorrowRequestDocument): BorrowingPaymentStatus {
  if (record.paymentStatus === "paid") {
    return { label: "Paid onsite", tone: "success" };
  }

  if (record.paymentStatus === "pending") {
    return { label: "Payment pending", tone: "info" };
  }

  if (record.paymentStatus === "waived") {
    return { label: "Fee waived", tone: "neutral" };
  }

  return {
    label: record.feeCents > 0 ? "Cash due on pickup" : "No payment due",
    tone: record.feeCents > 0 ? "warning" : "neutral",
  };
}

function mapPersistedBorrowRequest(record: BorrowRequestDocument): BorrowingRecord | null {
  const book = getAllBooksItemById(String(record.bookId));

  if (!book) {
    return null;
  }

  if (record.status === "pending") {
    return createPendingBorrowingRecord({
      book,
      copyId: String(record.bookCopyId),
      customDuration: record.durationType === "custom",
      id: String(record._id ?? `${record.userId}-${record.requestedAt.toISOString()}`),
      requestedAt: record.requestedAt.toISOString(),
      requestedDurationDays: record.requestedDurationDays,
    });
  }

  const timelineDate =
    record.status === "returned"
      ? record.returnedAt ?? record.updatedAt ?? record.requestedAt
      : record.dueAt ?? record.startedAt ?? record.requestedAt;

  return {
    id: String(record._id ?? `${record.userId}-${record.requestedAt.toISOString()}`),
    book,
    paymentStatus: buildPaymentStatus(record),
    status:
      record.status === "overdue"
        ? "overdue"
        : record.status === "returned"
          ? "returned"
          : "checked-out",
    supportingMeta:
      record.durationType === "custom"
        ? `Custom duration · Copy ${String(record.bookCopyId)}`
        : `Copy ${String(record.bookCopyId)}`,
    tab:
      record.status === "overdue"
        ? "overdue"
        : record.status === "returned"
          ? "returned"
          : "active",
    timelineLabel: record.status === "returned" ? "Returned on" : "Due on",
    timelineValue: formatBorrowingShortDate(timelineDate),
  };
}

export async function listPersistedBorrowingRecordsForUser(userId: string) {
  if (!isMongoConfigured()) {
    return [] satisfies ReadonlyArray<BorrowingRecord>;
  }

  try {
    const borrowRequests = await getBorrowRequestsCollection();
    const records = await borrowRequests
      .find({
        userId,
        status: { $in: ["pending", "active", "overdue", "returned"] },
      })
      .sort({ requestedAt: -1 })
      .toArray();

    return records
      .map((record) => mapPersistedBorrowRequest(record))
      .filter((record): record is BorrowingRecord => Boolean(record));
  } catch (error) {
    console.error("Failed to load persisted borrowing records", error);
    return [] satisfies ReadonlyArray<BorrowingRecord>;
  }
}