import { AdminRowActions } from "@/components/admin";

import type {
  AdminBorrowingActionHandlers,
  AdminBorrowingRecord,
} from "../types";

interface BorrowingActionsProps extends AdminBorrowingActionHandlers {
  align?: "end" | "start";
  density?: "card" | "table";
  record: AdminBorrowingRecord;
}

function BorrowingActions({
  align = "start",
  density = "card",
  onApproveBorrowing,
  onManageBorrowing,
  onMarkReturned,
  onRejectBorrowing,
  onSendReminder,
  record,
}: Readonly<BorrowingActionsProps>) {
  const actions =
    record.tab === "pending"
      ? [
          {
            label: "Manage",
            onAction: onManageBorrowing
              ? () => onManageBorrowing(record)
              : undefined,
            variant: "outline" as const,
          },
          {
            label: "Approve",
            onAction: onApproveBorrowing
              ? () => onApproveBorrowing(record)
              : undefined,
            variant: "default" as const,
          },
          {
            label: "Reject",
            onAction: onRejectBorrowing
              ? () => onRejectBorrowing(record)
              : undefined,
            variant: "ghost" as const,
            confirm: {
              title: `Reject ${record.bookTitle}?`,
              description:
                "Rejecting this request removes it from the pending queue and releases the borrowing slot for another member.",
              confirmLabel: "Reject request",
              tone: "danger" as const,
            },
          },
        ]
      : record.tab === "active"
        ? [
            {
              label: "Manage",
              onAction: onManageBorrowing
                ? () => onManageBorrowing(record)
                : undefined,
              variant: "ghost" as const,
            },
            {
              label: "Mark returned",
              onAction: onMarkReturned
                ? () => onMarkReturned(record)
                : undefined,
              variant: "outline" as const,
              confirm: {
                title: `Mark ${record.bookTitle} as returned?`,
                description:
                  "This updates the borrowing lifecycle, records the return time, and makes the assigned copy available again.",
                confirmLabel: "Mark returned",
                tone: "default" as const,
              },
            },
            {
              href: `/admin/books/${record.bookId}`,
              label: "Book",
              variant: "ghost" as const,
            },
          ]
        : record.tab === "overdue"
          ? [
              {
                label: "Manage",
                onAction: onManageBorrowing
                  ? () => onManageBorrowing(record)
                  : undefined,
                variant: "ghost" as const,
              },
              {
                label: "Send reminder",
                onAction: onSendReminder
                  ? () => onSendReminder(record)
                  : undefined,
                variant: "outline" as const,
                confirm: {
                  title: `Send reminder to ${record.memberName}?`,
                  description:
                    "This is a mock reminder action. It prepares the overdue table for future notification integrations.",
                  confirmLabel: "Send reminder",
                  tone: "default" as const,
                },
              },
              {
                href: `/admin/books/${record.bookId}`,
                label: "Book",
                variant: "ghost" as const,
              },
            ]
          : [
              {
                href: `/admin/books/${record.bookId}`,
                label: "Book",
                variant: "ghost" as const,
              },
            ];

    return (
      <AdminRowActions
        actions={actions}
        align={align}
        orientation={density === "table" ? "column" : "row"}
        size="xs"
        stretch={density === "table"}
      />
    );
}

export { BorrowingActions, type BorrowingActionsProps };