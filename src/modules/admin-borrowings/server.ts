import "server-only";

import { cache } from "react";

import {
  getBookRecordByIdFromStore,
  getUserRecordByIdFromStore,
  listStoredBookCopyRecordsForBook,
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
        const [book, copies, user] = await Promise.all([
          getBookRecordByIdFromStore(borrowing.bookId),
          listStoredBookCopyRecordsForBook(borrowing.bookId),
          getUserRecordByIdFromStore(borrowing.userId),
        ]);
        const assignedCopy = borrowing.bookCopyId
          ? copies.find((copy) => copy.id === borrowing.bookCopyId) ?? null
          : null;
        const assignableCopies =
          borrowing.status === "pending" ||
          borrowing.status === "active" ||
          borrowing.status === "overdue"
            ? copies
                .filter(
                  (copy) =>
                    copy.status === "available" || copy.id === borrowing.bookCopyId,
                )
                .sort((left, right) => left.copyCode.localeCompare(right.copyCode))
                .map((copy) => ({
                  label: `${copy.copyCode} - ${copy.branch}`,
                  value: copy.id,
                }))
            : [];
        const reviewStatusOptions =
          borrowing.status === "pending"
            ? [
                {
                  label: borrowing.customDuration ? "Needs review" : "Pending approval",
                  value: "pending" as const,
                },
                {
                  label: "Checked out",
                  value: "active" as const,
                },
                {
                  label: "Cancelled",
                  value: "cancelled" as const,
                },
              ]
            : borrowing.status === "active"
              ? [
                  {
                    label: "Checked out",
                    value: "active" as const,
                  },
                  {
                    label: "Overdue",
                    value: "overdue" as const,
                  },
                  {
                    label: "Returned",
                    value: "returned" as const,
                  },
                ]
              : borrowing.status === "overdue"
                ? [
                    {
                      label: "Overdue",
                      value: "overdue" as const,
                    },
                    {
                      label: "Returned",
                      value: "returned" as const,
                    },
                  ]
                : [];
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
          assignedCopyCode: assignedCopy?.copyCode,
          assignedCopyId: borrowing.bookCopyId,
          assignableCopies,
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
          reviewStatusOptions,
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