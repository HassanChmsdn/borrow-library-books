import "server-only";

import {
  listBookRecordsFromStore,
  listBorrowRequestRecordsFromStore,
  listUserRecordsFromStore,
} from "@/lib/data/server";
import {
  adminSharedNow,
  formatAdminCurrency,
  formatAdminDateTime,
} from "@/modules/admin-shared/mock-data";

import type {
  AdminFinancialModuleData,
  AdminFinancialRecord,
  AdminFinancialSummary,
} from "./types";

const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

function getFinancialActivityTimestamp(record: {
  requestedOn: string;
  returnedOn?: string;
  startedOn?: string;
}) {
  return record.returnedOn ?? record.startedOn ?? record.requestedOn;
}

function getPaymentStatusLabel(status: "cash-due" | "cash-settled" | "not-required") {
  if (status === "cash-settled") {
    return "Paid cash";
  }

  if (status === "cash-due") {
    return "Unpaid cash";
  }

  return "No fee";
}

function getPaymentStatusTone(options: {
  paymentStatus: "cash-due" | "cash-settled" | "not-required";
  borrowingStatus: "pending" | "active" | "overdue" | "returned" | "cancelled";
}): AdminFinancialRecord["paymentStatusTone"] {
  if (options.paymentStatus === "cash-settled") {
    return "success";
  }

  if (options.paymentStatus === "cash-due" && options.borrowingStatus === "overdue") {
    return "danger";
  }

  if (options.paymentStatus === "cash-due") {
    return "warning";
  }

  return "neutral";
}

function getPaymentHelperText(status: "cash-due" | "cash-settled" | "not-required") {
  if (status === "cash-settled") {
    return "Settled onsite";
  }

  if (status === "cash-due") {
    return "Onsite cash only";
  }

  return undefined;
}

function getActivityLabel(status: "pending" | "active" | "overdue" | "returned" | "cancelled") {
  if (status === "returned") {
    return "Returned";
  }

  if (status === "cancelled") {
    return "Rejected";
  }

  if (status === "pending") {
    return "Requested";
  }

  return "Started";
}

function createSummary(records: ReadonlyArray<AdminFinancialRecord>): AdminFinancialSummary {
  const settledRecords = records.filter((record) => record.paymentStatusLabel === "Paid cash");
  const outstandingRecords = records.filter((record) => record.paymentStatusLabel === "Unpaid cash");
  const settledRevenueCents = settledRecords.reduce((total, record) => total + record.feeCents, 0);
  const outstandingRevenueCents = outstandingRecords.reduce((total, record) => total + record.feeCents, 0);
  const totalFeeExposureCents = settledRevenueCents + outstandingRevenueCents;
  const last30DaySettledRevenueCents = settledRecords.reduce((total, record) => {
    const happenedAt = new Date(record.activityOn).getTime();

    return adminSharedNow.getTime() - happenedAt <= thirtyDaysInMs
      ? total + record.feeCents
      : total;
  }, 0);

  return {
    collectionRate:
      totalFeeExposureCents === 0
        ? 0
        : (settledRevenueCents / totalFeeExposureCents) * 100,
    feeBearingRecordCount: records.length,
    last30DaySettledRevenueCents,
    overdueCashCount: records.filter((record) => record.isOverdueCash).length,
    outstandingRevenueCents,
    settledRecordCount: settledRecords.length,
    settledRevenueCents,
  };
}

export async function getAdminFinancialModuleData(): Promise<AdminFinancialModuleData> {
  const [books, borrowings, users] = await Promise.all([
    listBookRecordsFromStore(),
    listBorrowRequestRecordsFromStore(),
    listUserRecordsFromStore(),
  ]);
  const bookById = new Map(books.map((book) => [book.id, book]));
  const userById = new Map(users.map((user) => [user.id, user]));
  const recentRecords = borrowings
    .filter((record) => record.feeCents > 0 && record.status !== "cancelled")
    .sort((left, right) =>
      getFinancialActivityTimestamp(right).localeCompare(getFinancialActivityTimestamp(left)),
    )
    .map((record) => {
      const book = bookById.get(record.bookId);
      const user = userById.get(record.userId);

        return {
          activityLabel: getActivityLabel(record.status),
          activityOn: getFinancialActivityTimestamp(record),
          bookTitle: book?.title ?? "Unknown book",
          branch: record.branch,
          feeCents: record.feeCents,
          id: record.id,
          isOverdueCash:
            record.paymentStatus === "cash-due" && record.status === "overdue",
          memberEmail: user?.email ?? "unknown@library.test",
          memberName: user?.fullName ?? "Unknown member",
          paymentHelperText: getPaymentHelperText(record.paymentStatus),
          paymentStatusLabel: getPaymentStatusLabel(record.paymentStatus),
          paymentStatusTone: getPaymentStatusTone({
            borrowingStatus: record.status,
            paymentStatus: record.paymentStatus,
          }),
        } satisfies AdminFinancialRecord;
      });

  return {
    recentRecords,
    summary: createSummary(recentRecords),
  };
}

export { formatAdminCurrency, formatAdminDateTime };