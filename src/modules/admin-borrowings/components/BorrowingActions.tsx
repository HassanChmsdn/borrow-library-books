import { AdminRowActions } from "@/components/admin";

import type {
  AdminBorrowingActionHandlers,
  AdminBorrowingRecord,
} from "../types";

interface BorrowingActionsProps extends AdminBorrowingActionHandlers {
  align?: "end" | "start";
  record: AdminBorrowingRecord;
}

function BorrowingActions({
  align = "start",
  onApproveBorrowing,
  onMarkReturned,
  onRejectBorrowing,
  onSendReminder,
  record,
}: Readonly<BorrowingActionsProps>) {
  const actions =
    record.tab === "pending"
      ? [
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
                "This is a mock rejection flow. It keeps the UI ready for a future moderation API without deleting anything now.",
              confirmLabel: "Reject request",
              tone: "danger" as const,
            },
          },
        ]
      : record.tab === "active"
        ? [
            {
              label: "Mark returned",
              onAction: onMarkReturned
                ? () => onMarkReturned(record)
                : undefined,
              variant: "outline" as const,
              confirm: {
                title: `Mark ${record.bookTitle} as returned?`,
                description:
                  "This mock action demonstrates the return workflow without persisting any server changes yet.",
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

  return <AdminRowActions actions={actions} align={align} />;
}

export { BorrowingActions, type BorrowingActionsProps };