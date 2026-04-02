import {
  AdminDetailSection,
  AdminEmptyState,
  AdminMetricStrip,
  AdminRowActions,
  AdminStatusBadge,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin";
import { FeeBadge } from "@/components/library";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatBookFeeLabel,
  getBookFeeTone,
} from "@/modules/catalog/book-presentation";

import type {
  AdminBorrowingRecord,
  AdminBorrowingsMetric,
  AdminBorrowingsTab,
} from "./types";

const emptyStates: Record<
  AdminBorrowingsTab,
  { title: string; description: string }
> = {
  active: {
    title: "No active borrowings",
    description:
      "Active admin borrowing rows will appear here once mock or live circulation data is available.",
  },
  pending: {
    title: "No pending pickups",
    description:
      "Pickup-ready items will appear here with branch and payment context.",
  },
  returned: {
    title: "No recent returns",
    description:
      "Returned rows can render here after the circulation history is wired in.",
  },
  overdue: {
    title: "No overdue items",
    description:
      "Overdue rows will show the moment reminders or escalation data exists.",
  },
};

function AdminBorrowingsMetricGrid({
  metrics,
}: Readonly<{ metrics: ReadonlyArray<AdminBorrowingsMetric> }>) {
  return (
    <AdminMetricStrip
      items={metrics.map((metric) => {
        const Icon = metric.icon;

        return {
          icon: <Icon aria-hidden="true" className="size-4" />,
          label: metric.label,
          supportingText: metric.supportingText,
          value: metric.value,
        };
      })}
    />
  );
}

function AdminBorrowingsMobileList({
  records,
}: Readonly<{ records: ReadonlyArray<AdminBorrowingRecord> }>) {
  return (
    <div className="grid gap-3 lg:hidden">
      {records.map((record) => (
        <Card key={record.id}>
          <CardContent className="grid gap-4 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <AdminStatusBadge
                label={record.statusLabel}
                tone={record.statusTone}
              />
              <FeeBadge
                label={formatBookFeeLabel(record.feeCents)}
                tone={getBookFeeTone(record.feeCents)}
              />
            </div>

            <div className="space-y-1">
              <p className="text-title-sm text-foreground font-semibold text-balance">
                {record.bookTitle}
              </p>
              <p className="text-body-sm text-text-secondary">
                {record.bookAuthor}
              </p>
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                {record.memberName} · {record.memberPlan}
              </p>
            </div>

            <AdminDetailSection
              items={[
                { label: record.dueLabel, value: record.dueValue },
                {
                  label: "Payment",
                  value: (
                    <AdminStatusBadge
                      label={record.paymentLabel}
                      tone={record.paymentTone}
                    />
                  ),
                },
                { label: "Branch", value: record.branch },
              ]}
            />

            <AdminRowActions
              align="end"
              actions={[
                { href: `/books/${record.bookId}`, label: "Book" },
                {
                  label: "Send reminder",
                  variant: "ghost",
                  confirm: {
                    title: `Send a reminder for ${record.bookTitle}?`,
                    description:
                      "This mock action demonstrates the shared confirm flow without backend wiring.",
                    confirmLabel: "Send reminder",
                    tone: "default",
                  },
                },
              ]}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminBorrowingsDesktopTable({
  records,
}: Readonly<{ records: ReadonlyArray<AdminBorrowingRecord> }>) {
  return (
    <div className="hidden lg:block">
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>Borrowing</AdminTableHead>
            <AdminTableHead>Status</AdminTableHead>
            <AdminTableHead>Due / Pickup</AdminTableHead>
            <AdminTableHead>Fee</AdminTableHead>
            <AdminTableHead>Payment</AdminTableHead>
            <AdminTableHead className="text-right">Action</AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {records.map((record) => (
            <AdminTableRow key={record.id}>
              <AdminTableCell>
                <div className="space-y-1.5">
                  <p className="text-body text-foreground font-medium">
                    {record.bookTitle}
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    {record.memberName} · {record.branch}
                  </p>
                  <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                    {record.memberPlan}
                  </p>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <AdminStatusBadge
                  label={record.statusLabel}
                  tone={record.statusTone}
                />
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1">
                  <p className="text-body-sm text-foreground font-medium">
                    {record.dueValue}
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    {record.dueLabel}
                  </p>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <FeeBadge
                  label={formatBookFeeLabel(record.feeCents)}
                  tone={getBookFeeTone(record.feeCents)}
                />
              </AdminTableCell>
              <AdminTableCell>
                <AdminStatusBadge
                  label={record.paymentLabel}
                  tone={record.paymentTone}
                />
              </AdminTableCell>
              <AdminTableCell className="text-right">
                <AdminRowActions
                  align="end"
                  actions={[
                    {
                      href: `/books/${record.bookId}`,
                      label: "Book",
                      variant: "ghost",
                    },
                    {
                      label: "Remind",
                      variant: "ghost",
                      confirm: {
                        title: `Send a reminder for ${record.memberName}?`,
                        description:
                          "This mock action keeps the admin row-action pattern ready for future circulation integrations.",
                        confirmLabel: "Send reminder",
                        tone: "default",
                      },
                    },
                  ]}
                />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}

function AdminBorrowingsEmptyState({
  activeTab,
}: Readonly<{ activeTab: AdminBorrowingsTab }>) {
  const emptyState = emptyStates[activeTab];

  return (
    <AdminEmptyState
      title={emptyState.title}
      description={emptyState.description}
    />
  );
}

export {
  AdminBorrowingsDesktopTable,
  AdminBorrowingsEmptyState,
  AdminBorrowingsMetricGrid,
  AdminBorrowingsMobileList,
};
