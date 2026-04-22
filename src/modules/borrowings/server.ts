import "server-only";

import { listStoredBorrowRequestRecordsForUser } from "@/lib/data/server";
import { getCatalogBookById } from "@/modules/catalog/server";

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

function buildPaymentStatus(
  record: Awaited<ReturnType<typeof listStoredBorrowRequestRecordsForUser>>[number],
): BorrowingPaymentStatus {
  if (record.status === "cancelled") {
    return { label: "No payment due", tone: "neutral" };
  }

  if (record.paymentStatus === "cash-settled") {
    return { label: "Paid onsite", tone: "success" };
  }

  if (record.paymentStatus === "not-required") {
    return { label: "No payment due", tone: "neutral" };
  }

  return {
    label: "Cash due on pickup",
    tone: record.status === "overdue" ? "danger" : "warning",
  };
}

async function mapPersistedBorrowRequest(
  record: Awaited<ReturnType<typeof listStoredBorrowRequestRecordsForUser>>[number],
): Promise<BorrowingRecord | null> {
  const book = await getCatalogBookById(record.bookId);

  if (!book) {
    return null;
  }

  if (record.status === "pending") {
    return createPendingBorrowingRecord({
      book,
      copyId: "assigned",
      customDuration: record.customDuration,
      id: record.id,
      requestedAt: record.requestedOn,
      requestedDurationDays: record.durationDays,
    });
  }

  if (record.status === "cancelled") {
    return {
      id: record.id,
      book,
      paymentStatus: buildPaymentStatus(record),
      status: "cancelled",
      supportingMeta: record.customDuration
        ? "Custom duration request declined"
        : "Request declined by library staff",
      tab: "cancelled",
      timelineLabel: "Rejected on",
      timelineValue: formatBorrowingShortDate(new Date(record.cancelledOn ?? record.requestedOn)),
    };
  }

  const timelineDate =
    record.status === "returned"
      ? record.returnedOn ?? record.startedOn ?? record.requestedOn
      : record.startedOn ?? record.requestedOn;

  return {
    id: record.id,
    book,
    paymentStatus: buildPaymentStatus(record),
    status:
      record.status === "overdue"
        ? "overdue"
        : record.status === "returned"
          ? "returned"
          : "checked-out",
    supportingMeta:
      record.customDuration ? "Custom duration request" : "Standard borrowing request",
    tab:
      record.status === "overdue"
        ? "overdue"
        : record.status === "returned"
          ? "returned"
          : "active",
    timelineLabel: record.status === "returned" ? "Returned on" : "Due on",
    timelineValue: formatBorrowingShortDate(new Date(timelineDate)),
  };
}

export async function listPersistedBorrowingRecordsForUser(userId: string) {
  try {
    const records = await listStoredBorrowRequestRecordsForUser(userId);
    const mappedRecords = await Promise.all(records.map((record) => mapPersistedBorrowRequest(record)));

    return mappedRecords.filter((record): record is BorrowingRecord => Boolean(record));
  } catch (error) {
    console.error("Failed to load persisted borrowing records", error);
    return [] satisfies ReadonlyArray<BorrowingRecord>;
  }
}