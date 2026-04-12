import "server-only";

import { cache } from "react";

import {
  getBookRecordByIdFromStore,
  getUserRecordByIdFromStore,
  listBorrowRequestRecordsFromStore,
} from "@/lib/data/server";
import {
  formatAdminDateTime,
  formatAdminShortDate,
  getAdminBorrowingLateLabel,
} from "@/modules/admin-shared/mock-data";

import type { AdminBorrowingRecord } from "./types";

export const listAdminBorrowingRecords = cache(
  async (): Promise<ReadonlyArray<AdminBorrowingRecord>> => {
    const borrowings = await listBorrowRequestRecordsFromStore();

    const records = await Promise.all(
      borrowings.map(async (borrowing) => {
        const [book, user] = await Promise.all([
          getBookRecordByIdFromStore(borrowing.bookId),
          getUserRecordByIdFromStore(borrowing.userId),
        ]);
        const dueOn = borrowing.startedOn
          ? new Date(
              new Date(borrowing.startedOn).getTime() + borrowing.durationDays * 24 * 60 * 60 * 1000,
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
          bookAuthor: book?.author ?? "Unknown author",
          bookCoverLabel: book?.coverLabel ?? "Book",
          bookCoverTone: book?.coverTone ?? "brand",
          bookId: borrowing.bookId,
          bookTitle: book?.title ?? "Unknown book",
          borrowingStatusLabel:
            borrowing.status === "pending"
              ? borrowing.customDuration
                ? "Needs review"
                : "Pending approval"
              : borrowing.status === "active"
                ? "Checked out"
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
                : borrowing.status === "overdue"
                  ? "danger"
                  : "neutral",
          branch: borrowing.branch,
          durationLabel: borrowing.customDuration
            ? `${borrowing.durationDays}-day custom`
            : `${borrowing.durationDays}-day loan`,
          feeCents: borrowing.feeCents,
          id: borrowing.id,
          isCustomDuration: borrowing.customDuration,
          memberEmail: user?.email ?? "unknown@library.test",
          memberMembership: user?.membershipLabel ?? "Member account",
          memberName: user?.fullName ?? "Unknown member",
          paymentHelperText:
            borrowing.paymentStatus === "cash-settled"
              ? "Settled onsite"
              : borrowing.paymentStatus === "cash-due"
                ? "Onsite cash only"
                : undefined,
          paymentStatusLabel:
            borrowing.paymentStatus === "cash-settled"
              ? "Paid cash"
              : borrowing.paymentStatus === "cash-due"
                ? "Unpaid cash"
                : "No fee",
          paymentStatusTone,
          tab: borrowing.status,
          timeline:
            borrowing.status === "pending"
              ? {
                  primaryLabel: "Requested",
                  primaryValue: formatAdminDateTime(borrowing.requestedOn),
                  secondaryLabel: "Pickup by",
                  secondaryValue: formatAdminDateTime(
                    new Date(new Date(borrowing.requestedOn).getTime() + 24 * 60 * 60 * 1000).toISOString(),
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
        } satisfies AdminBorrowingRecord;
      }),
    );

    return records;
  },
);