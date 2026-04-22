import {
  getBookRecordById,
  listBorrowRequestRecords,
  listVisibleUserRecords,
} from "@/lib/data";
import {
  getAppRoleDisplayLabel,
  hasAdminAccessRole,
} from "@/lib/auth/roles";
import {
  formatAdminCurrency,
  formatAdminShortDate,
} from "@/modules/admin-shared/mock-data";
import type { AdminFilterOption } from "@/components/admin";

import type {
  AdminUserFormValues,
  AdminUserBorrowingRecord,
  AdminUserPaymentStatus,
  AdminUserProfileRecord,
  AdminUserRecord,
  AdminUserStatus,
  AdminUsersRoleFilter,
} from "./types";
import { adminUserFormRoleValues } from "./types";

function getBorrowingFeeLabel(feeCents: number) {
  return feeCents === 0 ? "Free" : `${formatAdminCurrency(feeCents)} cash`;
}

function toUserBorrowingRecord(
  borrowing: ReturnType<typeof listBorrowRequestRecords>[number],
): AdminUserBorrowingRecord {
  const book = getBookRecordById(borrowing.bookId);
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
      borrowing.status === "returned" || borrowing.status === "cancelled" || !dueOn
        ? undefined
        : `Due ${formatAdminShortDate(dueOn)}`,
    completedDateLabel:
      borrowing.status === "cancelled"
        ? borrowing.cancelledOn
          ? `Rejected ${formatAdminShortDate(borrowing.cancelledOn)}`
          : undefined
        : borrowing.returnedOn
          ? `Returned ${formatAdminShortDate(borrowing.returnedOn)}`
          : undefined,
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

export const adminUsersRoleOptions: ReadonlyArray<
  AdminFilterOption<AdminUsersRoleFilter>
> = [
  { label: "All roles", value: "all" },
  ...adminUserFormRoleValues.map((role) => ({
    label: getAppRoleDisplayLabel(role),
    value: role,
  })),
];

export function getAdminUserRoleFieldOptions(
  roles: ReadonlyArray<AdminUserFormValues["role"]> = adminUserFormRoleValues,
): ReadonlyArray<AdminFilterOption<AdminUserFormValues["role"]>> {
  return roles.map((role) => ({
    label: getAppRoleDisplayLabel(role),
    value: role,
  }));
}

export const adminUserRoleFieldOptions = getAdminUserRoleFieldOptions();

export const adminUserStatusFieldOptions: ReadonlyArray<
  AdminFilterOption<AdminUserStatus>
> = [
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

export const adminUserFormDefaults: AdminUserFormValues = {
  accountStatus: "active",
  auth0UserId: "",
  email: "",
  fullName: "",
  onboardingNote: "",
  role: "member",
  temporaryPassword: "",
};

export const adminUserProfileRecords: ReadonlyArray<AdminUserProfileRecord> =
  listVisibleUserRecords().map((user) => {
    const borrowings = listBorrowRequestRecords().filter((record) => record.userId === user.id);
    const currentBorrowings = borrowings
      .filter((record) => record.status !== "returned" && record.status !== "cancelled")
      .map(toUserBorrowingRecord);
    const borrowingHistory = borrowings
      .filter((record) => record.status === "returned" || record.status === "cancelled")
      .sort((left, right) => {
        const rightTimestamp = right.returnedOn ?? right.cancelledOn ?? right.requestedOn;
        const leftTimestamp = left.returnedOn ?? left.cancelledOn ?? left.requestedOn;

        return rightTimestamp.localeCompare(leftTimestamp);
      })
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
      joinedDateLabel: formatAdminShortDate(user.joinedOn),
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

function createUserSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function createMockAdminUserRecord(
  values: AdminUserFormValues,
): AdminUserRecord {
  const normalizedEmail = values.email.trim().toLowerCase();
  const trimmedName = values.fullName.trim();
  const createdId = createUserSlug(trimmedName || normalizedEmail) || "new-user";
  const onboardingNote = values.onboardingNote.trim();
  const temporaryPassword = values.temporaryPassword.trim();

  return {
    borrowingSummaryLabel: "New account",
    borrowingSummaryMeta:
      onboardingNote.length > 0
        ? `Onboarding note: ${onboardingNote}`
        : temporaryPassword.length > 0
          ? "Temporary password prepared for mocked onboarding"
          : "No borrowing activity yet",
    email: normalizedEmail,
    fullName: trimmedName,
    id: `${createdId}-${Date.now().toString(36)}`,
    joinedDateLabel: formatAdminShortDate(new Date().toISOString()),
    role: values.role,
    status: values.accountStatus,
  };
}