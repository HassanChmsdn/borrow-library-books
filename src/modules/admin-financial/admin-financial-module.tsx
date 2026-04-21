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
import { LinkButton } from "@/components/ui/link-button";
import { getI18n } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";
import { translateAdminFinancialText } from "@/modules/admin-shared/i18n";

import { formatAdminCurrency, formatAdminDateTime } from "./server";
import type { AdminFinancialModuleProps, AdminFinancialRecord } from "./types";

type TranslateText = (text: string) => string;

function FinancialRecordPaymentStatus({
  helperText,
  label,
  tone,
  translateText,
}: Readonly<{
  helperText?: string;
  label: string;
  tone: AdminFinancialRecord["paymentStatusTone"];
  translateText: TranslateText;
}>) {

  return (
    <div className="space-y-1">
      <AdminStatusBadge label={label} tone={tone} />
      {helperText ? (
        <p className="text-caption text-text-tertiary">{translateText(helperText)}</p>
      ) : null}
    </div>
  );
}

function FinancialRecordsCardList({
  records,
  translateText,
}: Readonly<{
  records: ReadonlyArray<AdminFinancialRecord>;
  translateText: TranslateText;
}>) {

  return (
    <div className="grid gap-3 lg:hidden">
      {records.map((record) => (
        <AdminSectionCard key={record.id} contentClassName="space-y-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-title-sm text-foreground font-semibold text-balance">
                {translateText(record.bookTitle)}
              </p>
              <p className="text-body-sm text-text-secondary mt-1">
                {translateText(record.branch)}
              </p>
            </div>
            <FeeBadge label={formatAdminCurrency(record.feeCents)} tone="paid" />
          </div>

          <AdminUserAvatar
            name={translateText(record.memberName)}
            subtitle={record.memberEmail}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                {translateText("Payment status")}
              </p>
              <FinancialRecordPaymentStatus
                helperText={record.paymentHelperText}
                label={record.paymentStatusLabel}
                tone={record.paymentStatusTone}
                translateText={translateText}
              />
            </div>
            <div className="space-y-1">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                {translateText("Activity")}
              </p>
              <p className="text-body-sm text-foreground font-medium">
                {translateText(record.activityLabel)}
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
  translateText,
}: Readonly<{
  records: ReadonlyArray<AdminFinancialRecord>;
  translateText: TranslateText;
}>) {

  return (
    <div className="hidden lg:block">
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>{translateText("Member")}</AdminTableHead>
            <AdminTableHead>{translateText("Fee source")}</AdminTableHead>
            <AdminTableHead>{translateText("Fee")}</AdminTableHead>
            <AdminTableHead>{translateText("Payment status")}</AdminTableHead>
            <AdminTableHead>{translateText("Activity")}</AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {records.map((record) => (
            <AdminTableRow key={record.id}>
              <AdminTableCell>
                <AdminUserAvatar
                  name={translateText(record.memberName)}
                  subtitle={record.memberEmail}
                />
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1">
                  <p className="text-body text-foreground font-medium text-balance">
                    {translateText(record.bookTitle)}
                  </p>
                  <p className="text-body-sm text-text-secondary">{translateText(record.branch)}</p>
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
                  translateText={translateText}
                />
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1">
                  <p className="text-body-sm text-foreground font-medium">
                    {translateText(record.activityLabel)}
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

async function AdminFinancialModule({
  data,
  isLoading = false,
}: Readonly<AdminFinancialModuleProps>) {
  const { translateText } = await getI18n();

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
          <LinkButton href="/admin/borrowings" size="sm" variant="outline">
            {translateText("Open borrowings")}
          </LinkButton>
        }
      />

      <AdminMetricStrip
        items={[
          {
            icon: <HandCoins aria-hidden="true" className="size-4" />,
            label: "Settled cash",
            supportingText: "Borrowing fees already marked settled in the current shared data source.",
            trend: translateAdminFinancialText(`${summary.settledRecordCount} settled records`, translateText),
            value: formatAdminCurrency(summary.settledRevenueCents),
          },
          {
            icon: <TriangleAlert aria-hidden="true" className="size-4" />,
            label: "Outstanding cash",
            supportingText: "Fee exposure still waiting for onsite settlement before reconciliation is complete.",
            trend: translateAdminFinancialText(`${summary.overdueCashCount} overdue dues`, translateText),
            value: formatAdminCurrency(summary.outstandingRevenueCents),
          },
          {
            icon: <BookCopy aria-hidden="true" className="size-4" />,
            label: "Fee-bearing records",
            supportingText: "Borrowing records that currently carry a payable borrowing fee.",
            trend: translateAdminFinancialText(
              `${formatAdminCurrency(summary.last30DaySettledRevenueCents)} last 30 days`,
              translateText,
            ),
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
              <FinancialRecordsCardList
                records={recentRecords.slice(0, 8)}
                translateText={translateText}
              />
              <FinancialRecordsTable
                records={recentRecords.slice(0, 8)}
                translateText={translateText}
              />
            </>
          ) : (
            <AdminEmptyState
              title="No fee records are available yet"
              description="Borrowing fee records will appear here once fee-bearing borrowings are seeded or synchronized from the live payment source."
              action={
                <LinkButton href="/admin/borrowings" size="sm" variant="outline">
                  Review borrowings
                </LinkButton>
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
                  {translateText("Total fee exposure")}
                </p>
                <p className="text-title-sm text-foreground mt-2 font-semibold">
                  {formatAdminCurrency(
                    summary.settledRevenueCents + summary.outstandingRevenueCents,
                  )}
                </p>
                <p className="text-body-sm text-text-secondary mt-1">
                  {translateText("Settled and unpaid borrowing fees combined.")}
                </p>
              </div>

              <div className="rounded-card border-border-subtle bg-elevated border px-4 py-3">
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  {translateText("Last 30 days")}
                </p>
                <p className="text-title-sm text-foreground mt-2 font-semibold">
                  {formatAdminCurrency(summary.last30DaySettledRevenueCents)}
                </p>
                <p className="text-body-sm text-text-secondary mt-1">
                  {translateText("Recently settled onsite cash fees.")}
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
                  <p className="text-body-sm text-foreground font-medium">{translateText("Settled records")}</p>
                  <p className="text-caption text-text-secondary mt-1">
                    {translateText("Borrowing fees already closed out onsite.")}
                  </p>
                </div>
                <span className="text-body text-foreground font-semibold">
                  {summary.settledRecordCount}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 rounded-lg border border-transparent bg-background px-3 py-2.5">
                <div>
                  <p className="text-body-sm text-foreground font-medium">{translateText("Open cash exposure")}</p>
                  <p className="text-caption text-text-secondary mt-1">
                    {translateText("Unsettled borrowing fees still needing collection.")}
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
                  <p className="text-body-sm text-foreground font-medium">{translateText("Overdue unpaid fees")}</p>
                  <p className="text-caption text-text-secondary mt-1">
                    {translateText("Overdue borrowing records that still show unpaid cash.")}
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

async function AdminFinancialLoadingState() {
  const { translateText } = await getI18n();

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow={translateText("Financial")}
        title={translateText("Financial operations")}
        description={translateText("Loading fee tracking and finance review surfaces.")}
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