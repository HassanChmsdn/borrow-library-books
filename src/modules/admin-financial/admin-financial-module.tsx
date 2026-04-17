import Link from "next/link";
import {
  BookCopy,
  Clock3,
  HandCoins,
  TriangleAlert,
} from "lucide-react";

import {
  AdminDataTable,
  AdminEmptyState,
  AdminMetricStrip,
  AdminPageHeader,
  AdminSectionCard,
  AdminStatusBadge,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  AdminUserAvatar,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { FeeBadge } from "@/components/library";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { formatAdminCurrency, formatAdminDateTime } from "./server";
import type { AdminFinancialModuleProps, AdminFinancialRecord } from "./types";

function FinancialRecordPaymentStatus({
  helperText,
  label,
  tone,
}: Readonly<{
  helperText?: string;
  label: string;
  tone: AdminFinancialRecord["paymentStatusTone"];
}>) {
  return (
    <div className="space-y-1">
      <AdminStatusBadge label={label} tone={tone} />
      {helperText ? (
        <p className="text-caption text-text-tertiary">{helperText}</p>
      ) : null}
    </div>
  );
}

function FinancialRecordsCardList({
  records,
}: Readonly<{
  records: ReadonlyArray<AdminFinancialRecord>;
}>) {
  return (
    <div className="grid gap-3 lg:hidden">
      {records.map((record) => (
        <AdminSectionCard key={record.id} contentClassName="space-y-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-title-sm text-foreground font-semibold text-balance">
                {record.bookTitle}
              </p>
              <p className="text-body-sm text-text-secondary mt-1">
                {record.branch}
              </p>
            </div>
            <FeeBadge label={formatAdminCurrency(record.feeCents)} tone="paid" />
          </div>

          <AdminUserAvatar name={record.memberName} subtitle={record.memberEmail} />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Payment status
              </p>
              <FinancialRecordPaymentStatus
                helperText={record.paymentHelperText}
                label={record.paymentStatusLabel}
                tone={record.paymentStatusTone}
              />
            </div>
            <div className="space-y-1">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Activity
              </p>
              <p className="text-body-sm text-foreground font-medium">
                {record.activityLabel}
              </p>
              <p className="text-body-sm text-text-secondary">
                {formatAdminDateTime(record.activityOn)}
              </p>
            </div>
          </div>
        </AdminSectionCard>
      ))}
    </div>
  );
}

function FinancialRecordsTable({
  records,
}: Readonly<{
  records: ReadonlyArray<AdminFinancialRecord>;
}>) {
  return (
    <div className="hidden lg:block">
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>Member</AdminTableHead>
            <AdminTableHead>Fee source</AdminTableHead>
            <AdminTableHead>Fee</AdminTableHead>
            <AdminTableHead>Payment status</AdminTableHead>
            <AdminTableHead>Activity</AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {records.map((record) => (
            <AdminTableRow key={record.id}>
              <AdminTableCell>
                <AdminUserAvatar name={record.memberName} subtitle={record.memberEmail} />
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1">
                  <p className="text-body text-foreground font-medium text-balance">
                    {record.bookTitle}
                  </p>
                  <p className="text-body-sm text-text-secondary">{record.branch}</p>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <FeeBadge label={formatAdminCurrency(record.feeCents)} tone="paid" />
              </AdminTableCell>
              <AdminTableCell>
                <FinancialRecordPaymentStatus
                  helperText={record.paymentHelperText}
                  label={record.paymentStatusLabel}
                  tone={record.paymentStatusTone}
                />
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1">
                  <p className="text-body-sm text-foreground font-medium">
                    {record.activityLabel}
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    {formatAdminDateTime(record.activityOn)}
                  </p>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}

function AdminFinancialModule({
  data,
  isLoading = false,
}: Readonly<AdminFinancialModuleProps>) {
  if (isLoading) {
    return <AdminFinancialLoadingState />;
  }

  const { recentRecords, summary } = data;
  const hasRecords = recentRecords.length > 0;

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Financial"
        title="Financial operations"
        description="Monitor borrowing-fee intake, unresolved cash exposure, and recent fee records in a shared admin workspace that can later connect to real payments and reporting pipelines."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/borrowings">Open borrowings</Link>
          </Button>
        }
      />

      <AdminMetricStrip
        items={[
          {
            icon: <HandCoins aria-hidden="true" className="size-4" />,
            label: "Settled cash",
            supportingText: "Borrowing fees already marked settled in the current shared data source.",
            trend: `${summary.settledRecordCount} settled records`,
            value: formatAdminCurrency(summary.settledRevenueCents),
          },
          {
            icon: <TriangleAlert aria-hidden="true" className="size-4" />,
            label: "Outstanding cash",
            supportingText: "Fee exposure still waiting for onsite settlement before reconciliation is complete.",
            trend: `${summary.overdueCashCount} overdue dues`,
            value: formatAdminCurrency(summary.outstandingRevenueCents),
          },
          {
            icon: <BookCopy aria-hidden="true" className="size-4" />,
            label: "Fee-bearing records",
            supportingText: "Borrowing records that currently carry a payable borrowing fee.",
            trend: `${formatAdminCurrency(summary.last30DaySettledRevenueCents)} last 30 days`,
            value: String(summary.feeBearingRecordCount),
          },
          {
            icon: <Clock3 aria-hidden="true" className="size-4" />,
            label: "Collection rate",
            supportingText: "Share of current fee exposure already captured as settled cash in the admin dataset.",
            trend: hasRecords ? "Exposure-based" : "No fees yet",
            value: `${Math.round(summary.collectionRate)}%`,
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.9fr)] xl:items-start">
        <AdminDataTable
          title="Recent borrowing fee records"
          description="A finance-ready list of borrowing fee records derived from the current borrowings store. The structure is intentionally suitable for later replacement with real payment ledger entries, filters, and exports."
        >
          {hasRecords ? (
            <>
              <FinancialRecordsCardList records={recentRecords.slice(0, 8)} />
              <FinancialRecordsTable records={recentRecords.slice(0, 8)} />
            </>
          ) : (
            <AdminEmptyState
              title="No fee records are available yet"
              description="Borrowing fee records will appear here once fee-bearing borrowings are seeded or synchronized from the live payment source."
              action={
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/borrowings">Review borrowings</Link>
                </Button>
              }
            />
          )}
        </AdminDataTable>

        <div className="space-y-6">
          <AdminSectionCard
            title="Revenue summary"
            description="These totals come from the existing borrowing-fee model so the section remains safe on mock data today and extensible for a real reporting backend later."
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-card border-border-subtle bg-elevated border px-4 py-3">
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Total fee exposure
                </p>
                <p className="text-title-sm text-foreground mt-2 font-semibold">
                  {formatAdminCurrency(
                    summary.settledRevenueCents + summary.outstandingRevenueCents,
                  )}
                </p>
                <p className="text-body-sm text-text-secondary mt-1">
                  Settled and unpaid borrowing fees combined.
                </p>
              </div>

              <div className="rounded-card border-border-subtle bg-elevated border px-4 py-3">
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Last 30 days
                </p>
                <p className="text-title-sm text-foreground mt-2 font-semibold">
                  {formatAdminCurrency(summary.last30DaySettledRevenueCents)}
                </p>
                <p className="text-body-sm text-text-secondary mt-1">
                  Recently settled onsite cash fees.
                </p>
              </div>
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="Collection posture"
            description="A lightweight operational snapshot for staff who need to review cash due pressure before deeper payment tooling exists."
          >
            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-3 rounded-lg border border-transparent bg-background px-3 py-2.5">
                <div>
                  <p className="text-body-sm text-foreground font-medium">Settled records</p>
                  <p className="text-caption text-text-secondary mt-1">
                    Borrowing fees already closed out onsite.
                  </p>
                </div>
                <span className="text-body text-foreground font-semibold">
                  {summary.settledRecordCount}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 rounded-lg border border-transparent bg-background px-3 py-2.5">
                <div>
                  <p className="text-body-sm text-foreground font-medium">Open cash exposure</p>
                  <p className="text-caption text-text-secondary mt-1">
                    Unsettled borrowing fees still needing collection.
                  </p>
                </div>
                <span
                  className={cn(
                    "text-body font-semibold",
                    summary.outstandingRevenueCents > 0 ? "text-warning" : "text-foreground",
                  )}
                >
                  {formatAdminCurrency(summary.outstandingRevenueCents)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 rounded-lg border border-transparent bg-background px-3 py-2.5">
                <div>
                  <p className="text-body-sm text-foreground font-medium">Overdue unpaid fees</p>
                  <p className="text-caption text-text-secondary mt-1">
                    Overdue borrowing records that still show unpaid cash.
                  </p>
                </div>
                <span
                  className={cn(
                    "text-body font-semibold",
                    summary.overdueCashCount > 0 ? "text-danger" : "text-foreground",
                  )}
                >
                  {summary.overdueCashCount}
                </span>
              </div>
            </div>
          </AdminSectionCard>
        </div>
      </div>
    </div>
  );
}

function AdminFinancialLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Financial"
        title="Financial operations"
        description="Loading fee tracking and finance review surfaces."
      />
      <LoadingSkeleton count={4} variant="kpi" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.9fr)]">
        <LoadingSkeleton count={1} variant="table" />
        <div className="space-y-6">
          <LoadingSkeleton count={2} variant="card" />
        </div>
      </div>
    </div>
  );
}

export { AdminFinancialLoadingState, AdminFinancialModule };