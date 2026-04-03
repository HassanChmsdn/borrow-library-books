import { adminSharedBorrowings, adminSharedUsers, formatAdminJoinedDate, formatAdminShortDate, formatAdminCurrency, getAdminSharedBook } from "@/modules/admin-shared/mock-data";
import type { AdminFilterOption } from "@/components/admin";

import type {
  AdminUserBorrowingRecord,
  AdminUserPaymentStatus,
  AdminUserProfileRecord,
  AdminUserRecord,
  AdminUsersRoleFilter,
} from "./types";

function getBorrowingFeeLabel(feeCents: number) {
  return feeCents === 0 ? "Free" : `${formatAdminCurrency(feeCents)} cash`;
}

function toUserBorrowingRecord(
  borrowing: (typeof adminSharedBorrowings)[number],
): AdminUserBorrowingRecord {
  const book = getAdminSharedBook(borrowing.bookId);
  const dueOn = borrowing.startedOn
    ? new Date(
        new Date(borrowing.startedOn).getTime() +
          borrowing.durationDays * 24 * 60 * 60 * 1000,
      ).toISOString()
    : undefined;

  return {
    id: borrowing.id,
    bookTitle: book?.title ?? "Unknown book",
    bookAuthor: book?.author ?? "Unknown author",
    bookHref: `/admin/books/${borrowing.bookId}`,
    durationLabel: `${borrowing.durationDays} days`,
    startedDateLabel: borrowing.startedOn
      ? `Started ${formatAdminShortDate(borrowing.startedOn)}`
      : `Requested ${formatAdminShortDate(borrowing.requestedOn)}`,
    dueDateLabel:
      borrowing.status === "returned" || !dueOn ? undefined : `Due ${formatAdminShortDate(dueOn)}`,
    completedDateLabel:
      borrowing.returnedOn ? `Returned ${formatAdminShortDate(borrowing.returnedOn)}` : undefined,
    feeLabel: getBorrowingFeeLabel(borrowing.feeCents),
    paymentStatus: borrowing.paymentStatus as AdminUserPaymentStatus,
    status: borrowing.status,
    customDurationRequested: borrowing.customDuration,
    note: borrowing.note,
  };
}

function getBorrowingSummaryLabel(
  activeCount: number,
  pendingCount: number,
  overdueCount: number,
  totalCount: number,
  role: AdminUserRecord["role"],
) {
  if (role === "admin" && totalCount === 0) {
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

  return role === "admin"
    ? "Staff account used for admin operations"
    : "No borrowing activity yet";
}

export const adminUsersRoleOptions: ReadonlyArray<
  AdminFilterOption<AdminUsersRoleFilter>
> = [
  { label: "All roles", value: "all" },
  { label: "Users", value: "user" },
  { label: "Admins", value: "admin" },
];

export const adminUserProfileRecords: ReadonlyArray<AdminUserProfileRecord> =
  adminSharedUsers.map((user) => {
    const borrowings = adminSharedBorrowings.filter((record) => record.userId === user.id);
    const currentBorrowings = borrowings
      .filter((record) => record.status !== "returned")
      .map(toUserBorrowingRecord);
    const borrowingHistory = borrowings
      .filter((record) => record.status === "returned")
      .sort((left, right) => (right.returnedOn ?? "").localeCompare(left.returnedOn ?? ""))
      .map(toUserBorrowingRecord);

    const activeCount = currentBorrowings.filter((record) => record.status === "active").length;
    const pendingCount = currentBorrowings.filter((record) => record.status === "pending").length;
    const overdueCount = currentBorrowings.filter((record) => record.status === "overdue").length;

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      joinedDateLabel: formatAdminJoinedDate(user.joinedOn),
      profileHref: `/admin/users/${user.id}`,
      borrowingSummaryLabel: getBorrowingSummaryLabel(
        activeCount,
        pendingCount,
        overdueCount,
        borrowings.length,
        user.role,
      ),
      borrowingSummaryMeta: getBorrowingSummaryMeta(
        currentBorrowings,
        borrowingHistory,
        user.role,
      ),
      profileSummaryNote: user.profileNote,
      totalBorrowingsCount: borrowings.length,
      activeBorrowingsCount: currentBorrowings.length,
      overdueCount,
      currentBorrowings,
      borrowingHistory,
    };
  });

function createAdminUserRecord(record: AdminUserProfileRecord): AdminUserRecord {
  return {
    borrowingSummaryLabel: record.borrowingSummaryLabel,
    borrowingSummaryMeta: record.borrowingSummaryMeta,
    email: record.email,
    fullName: record.fullName,
    id: record.id,
    joinedDateLabel: record.joinedDateLabel,
    profileHref: record.profileHref,
    role: record.role,
    status: record.status,
  };
}

export const adminUserRecords: ReadonlyArray<AdminUserRecord> =
  adminUserProfileRecords.map(createAdminUserRecord);

export function getAdminUserRecordById(userId: string) {
  return adminUserRecords.find((record) => record.id === userId);
}

export function getAdminUserProfileRecordById(userId: string) {
  return adminUserProfileRecords.find((record) => record.id === userId);
}