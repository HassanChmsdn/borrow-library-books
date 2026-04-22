import "server-only";

import {
  getBookRecordByIdFromStore,
  listBorrowRequestRecordsFromStore,
  listUserRecordsFromStore,
} from "@/lib/data/server";
import {
  formatAdminCurrency,
  formatAdminJoinedDate,
  formatAdminShortDate,
} from "@/modules/admin-shared/mock-data";
import { hasAdminAccessRole } from "@/lib/auth/roles";

import type {
  AdminUserBorrowingRecord,
  AdminUserPaymentStatus,
  AdminUserProfileRecord,
  AdminUserRecord,
} from "./types";

function getBorrowingFeeLabel(feeCents: number) {
  return feeCents === 0 ? "Free" : `${formatAdminCurrency(feeCents)} cash`;
}

function toAdminPaymentStatus(status: "cash-due" | "cash-settled" | "not-required") {
  if (status === "cash-settled") {
    return "cash-settled" satisfies AdminUserPaymentStatus;
  }

  if (status === "cash-due") {
    return "cash-due" satisfies AdminUserPaymentStatus;
  }

  return "not-required" satisfies AdminUserPaymentStatus;
}

async function toUserBorrowingRecord(
  borrowing: Awaited<ReturnType<typeof listBorrowRequestRecordsFromStore>>[number],
): Promise<AdminUserBorrowingRecord> {
  const book = await getBookRecordByIdFromStore(borrowing.bookId);
  const dueOn = borrowing.startedOn
    ? new Date(
        new Date(borrowing.startedOn).getTime() + borrowing.durationDays * 24 * 60 * 60 * 1000,
      ).toISOString()
    : undefined;

  return {
    bookAuthor: book?.author ?? "Unknown author",
    bookHref: `/admin/books/${borrowing.bookId}`,
    bookTitle: book?.title ?? "Unknown book",
    completedDateLabel:
      borrowing.status === "cancelled"
        ? borrowing.cancelledOn
          ? `Rejected ${formatAdminShortDate(borrowing.cancelledOn)}`
          : undefined
        : borrowing.returnedOn
          ? `Returned ${formatAdminShortDate(borrowing.returnedOn)}`
          : undefined,
    customDurationRequested: borrowing.customDuration,
    dueDateLabel:
      borrowing.status === "returned" || borrowing.status === "cancelled" || !dueOn
        ? undefined
        : `Due ${formatAdminShortDate(dueOn)}`,
    durationLabel: `${borrowing.durationDays} days`,
    feeLabel: getBorrowingFeeLabel(borrowing.feeCents),
    id: borrowing.id,
    note: borrowing.note,
    paymentStatus: toAdminPaymentStatus(borrowing.paymentStatus),
    startedDateLabel: borrowing.startedOn
      ? `Started ${formatAdminShortDate(borrowing.startedOn)}`
      : `Requested ${formatAdminShortDate(borrowing.requestedOn)}`,
    status: borrowing.status,
  };
}

function getBorrowingSummaryLabel(
  activeCount: number,
  pendingCount: number,
  overdueCount: number,
  totalCount: number,
  role: AdminUserRecord["role"],
) {
  if (hasAdminAccessRole(role) && totalCount === 0) {
    return "No personal loans";
  }

  if (overdueCount > 0) {
    return overdueCount === 1 ? "1 overdue case" : `${overdueCount} overdue cases`;
  }

  if (activeCount > 0 && pendingCount > 0) {
    return `${activeCount} active, ${pendingCount} pending`;
  }

  if (pendingCount > 0) {
    return pendingCount === 1 ? "1 pending request" : `${pendingCount} pending requests`;
  }

  if (activeCount > 0) {
    return activeCount === 1 ? "1 active loan" : `${activeCount} active loans`;
  }

  if (totalCount === 0) {
    return "New account";
  }

  return totalCount === 1 ? "1 completed borrowing" : `${totalCount} completed borrowings`;
}

function getBorrowingSummaryMeta(
  currentBorrowings: ReadonlyArray<AdminUserBorrowingRecord>,
  borrowingHistory: ReadonlyArray<AdminUserBorrowingRecord>,
  role: AdminUserRecord["role"],
) {
  const overdue = currentBorrowings.find((record) => record.status === "overdue");

  if (overdue?.dueDateLabel) {
    return overdue.dueDateLabel;
  }

  const pendingCount = currentBorrowings.filter((record) => record.status === "pending").length;

  if (pendingCount > 0) {
    return pendingCount === 1
      ? "1 request awaiting approval"
      : `${pendingCount} requests awaiting approval`;
  }

  const active = currentBorrowings.find((record) => record.dueDateLabel);

  if (active?.dueDateLabel) {
    return active.dueDateLabel;
  }

  if (borrowingHistory[0]?.completedDateLabel) {
    return borrowingHistory[0].completedDateLabel;
  }

  return hasAdminAccessRole(role)
    ? "Staff account used for admin operations"
    : "No borrowing activity yet";
}

export async function listAdminUserProfileRecords(): Promise<
  ReadonlyArray<AdminUserProfileRecord>
> {
  const [users, borrowings] = await Promise.all([
    listUserRecordsFromStore(),
    listBorrowRequestRecordsFromStore(),
  ]);

  return Promise.all(
    users.map(async (user) => {
        const userBorrowings = borrowings.filter((record) => record.userId === user.id);
        const currentBorrowings = await Promise.all(
          userBorrowings
            .filter((record) => record.status !== "returned" && record.status !== "cancelled")
            .map((record) => toUserBorrowingRecord(record)),
        );
        const borrowingHistory = await Promise.all(
          userBorrowings
            .filter((record) => record.status === "returned" || record.status === "cancelled")
            .sort((left, right) => {
              const rightTimestamp = right.returnedOn ?? right.cancelledOn ?? right.requestedOn;
              const leftTimestamp = left.returnedOn ?? left.cancelledOn ?? left.requestedOn;

              return rightTimestamp.localeCompare(leftTimestamp);
            })
            .map((record) => toUserBorrowingRecord(record)),
        );
        const role = user.role;
        const activeCount = currentBorrowings.filter((record) => record.status === "active").length;
        const pendingCount = currentBorrowings.filter((record) => record.status === "pending").length;
        const overdueCount = currentBorrowings.filter((record) => record.status === "overdue").length;

        return {
          activeBorrowingsCount: currentBorrowings.length,
          borrowingHistory,
          borrowingSummaryLabel: getBorrowingSummaryLabel(
            activeCount,
            pendingCount,
            overdueCount,
            userBorrowings.length,
            role,
          ),
          borrowingSummaryMeta: getBorrowingSummaryMeta(currentBorrowings, borrowingHistory, role),
          currentBorrowings,
          email: user.email,
          fullName: user.fullName,
          id: user.id,
          joinedDateLabel: formatAdminJoinedDate(user.joinedOn),
          overdueCount,
          profileHref: `/admin/users/${user.id}`,
          profileSummaryNote: user.profileNote,
          role,
          status: user.status,
          totalBorrowingsCount: userBorrowings.length,
        } satisfies AdminUserProfileRecord;
    }),
  );
}

export function toAdminUserRecord(user: AdminUserProfileRecord): AdminUserRecord {
  return {
    borrowingSummaryLabel: user.borrowingSummaryLabel,
    borrowingSummaryMeta: user.borrowingSummaryMeta,
    email: user.email,
    fullName: user.fullName,
    id: user.id,
    joinedDateLabel: user.joinedDateLabel,
    profileHref: user.profileHref,
    role: user.role,
    status: user.status,
  };
}

export async function listAdminUserRecords(): Promise<ReadonlyArray<AdminUserRecord>> {
  const users = await listAdminUserProfileRecords();

  return users.map(toAdminUserRecord);
}

export async function getAdminUserProfileRecordByIdFromStore(userId: string) {
  const users = await listAdminUserProfileRecords();

  return users.find((user) => user.id === userId) ?? null;
}