import {
  getBookRecordById,
  getUserRecordById,
  listBorrowRequestRecords,
} from "@/lib/data";
import {
  formatAdminDateTime,
  formatAdminShortDate,
  getAdminBorrowingLateLabel,
} from "@/modules/admin-shared/mock-data";

import type { AdminBorrowingRecord, AdminBorrowingsTab } from "./types";

export const adminBorrowingsTabLabels: Record<AdminBorrowingsTab, string> = {
  pending: "Pending",
  active: "Active",
  overdue: "Overdue",
  returned: "Returned",
  cancelled: "Rejected",
};

export const adminBorrowingsRecords: ReadonlyArray<AdminBorrowingRecord> =
  listBorrowRequestRecords().map((borrowing) => {
    const book = getBookRecordById(borrowing.bookId);
    const user = getUserRecordById(borrowing.userId);
    const dueOn = borrowing.startedOn
      ? new Date(
          new Date(borrowing.startedOn).getTime() +
            borrowing.durationDays * 24 * 60 * 60 * 1000,
        ).toISOString()
      : undefined;

    const paymentStatusTone =
      borrowing.paymentStatus === "cash-settled"
        ? "success"
        : borrowing.paymentStatus === "cash-due" && borrowing.status === "overdue"
          ? "danger"
          : borrowing.paymentStatus === "cash-due"
            ? "warning"
            : "success";

    return {
      id: borrowing.id,
      bookId: borrowing.bookId,
      bookTitle: book?.title ?? "Unknown book",
      bookAuthor: book?.author ?? "Unknown author",
      bookCoverLabel: book?.coverLabel ?? "Book",
      bookCoverTone: (book?.coverTone ?? "brand") as AdminBorrowingRecord["bookCoverTone"],
      memberName: user?.fullName ?? "Unknown member",
      memberEmail: user?.email ?? "unknown@library.test",
      memberMembership: user?.membershipLabel ?? "Member account",
      branch: borrowing.branch,
      durationLabel: borrowing.customDuration
        ? `${borrowing.durationDays}-day custom`
        : `${borrowing.durationDays}-day loan`,
      isCustomDuration: borrowing.customDuration,
      timeline:
        borrowing.status === "pending"
          ? {
              primaryLabel: "Requested",
              primaryValue: formatAdminDateTime(borrowing.requestedOn),
              secondaryLabel: "Pickup by",
              secondaryValue: formatAdminDateTime(
                new Date(
                  new Date(borrowing.requestedOn).getTime() + 24 * 60 * 60 * 1000,
                ).toISOString(),
              ),
            }
          : borrowing.status === "returned"
            ? {
                primaryLabel: "Started",
                primaryValue: borrowing.startedOn
                  ? formatAdminShortDate(borrowing.startedOn)
                  : formatAdminDateTime(borrowing.requestedOn),
                secondaryLabel: "Returned",
                secondaryValue: borrowing.returnedOn
                  ? formatAdminShortDate(borrowing.returnedOn)
                  : undefined,
              }
            : borrowing.status === "overdue"
              ? {
                  primaryLabel: "Due",
                  primaryValue: dueOn ? formatAdminShortDate(dueOn) : "No due date",
                  secondaryLabel: "Overdue",
                  secondaryValue: dueOn ? getAdminBorrowingLateLabel(dueOn) : undefined,
                }
              : {
                  primaryLabel: "Started",
                  primaryValue: borrowing.startedOn
                    ? formatAdminShortDate(borrowing.startedOn)
                    : formatAdminDateTime(borrowing.requestedOn),
                  secondaryLabel: "Due",
                  secondaryValue: dueOn ? formatAdminShortDate(dueOn) : undefined,
                },
      feeCents: borrowing.feeCents,
      paymentStatusLabel:
        borrowing.paymentStatus === "cash-settled"
          ? "Paid cash"
          : borrowing.paymentStatus === "cash-due"
            ? "Unpaid cash"
            : "No fee",
      paymentStatusTone,
      paymentHelperText:
        borrowing.paymentStatus === "cash-settled"
          ? "Settled onsite"
          : borrowing.paymentStatus === "cash-due"
            ? "Onsite cash only"
            : undefined,
      borrowingStatusLabel:
        borrowing.status === "pending"
          ? borrowing.customDuration
            ? "Needs review"
            : "Pending approval"
          : borrowing.status === "active"
            ? "Checked out"
            : borrowing.status === "cancelled"
              ? "Rejected"
            : borrowing.status === "overdue"
              ? "Overdue"
              : "Returned",
      borrowingStatusTone:
        borrowing.status === "pending"
          ? borrowing.customDuration
            ? "info"
            : "warning"
          : borrowing.status === "active"
            ? "success"
            : borrowing.status === "cancelled"
              ? "neutral"
            : borrowing.status === "overdue"
              ? "danger"
              : "neutral",
      tab: borrowing.status,
    };
  });