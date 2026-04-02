import Link from "next/link";

import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  KpiCard,
} from "@/components/admin";
import { EmptyState } from "@/components/feedback";
import { BorrowStatusBadge, FeeBadge } from "@/components/library";
import { Button } from "@/components/ui/button";
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <KpiCard
            key={metric.label}
            icon={<Icon aria-hidden="true" className="size-4" />}
            label={metric.label}
            supportingText={metric.supportingText}
            value={metric.value}
          />
        );
      })}
    </div>
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
              <BorrowStatusBadge
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

            <div className="grid gap-3 rounded-2xl border border-dashed border-black/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-body-sm text-text-secondary">
                  {record.dueLabel}
                </span>
                <span className="text-body-sm text-foreground font-medium">
                  {record.dueValue}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-body-sm text-text-secondary">
                  Payment
                </span>
                <BorrowStatusBadge
                  label={record.paymentLabel}
                  tone={record.paymentTone}
                />
              </div>
              <p className="text-body-sm text-text-secondary">
                {record.branch}
              </p>
            </div>

            <div className="flex justify-end">
              <Button asChild size="sm" variant="outline">
                <Link href={`/books/${record.bookId}`}>View book</Link>
              </Button>
            </div>
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
                <BorrowStatusBadge
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
                <BorrowStatusBadge
                  label={record.paymentLabel}
                  tone={record.paymentTone}
                />
              </AdminTableCell>
              <AdminTableCell className="text-right">
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/books/${record.bookId}`}>Book</Link>
                </Button>
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
    <EmptyState
      size="sm"
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
