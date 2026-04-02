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
import { BorrowStatusBadge } from "@/components/library";
import { Card, CardContent } from "@/components/ui/card";

import type { AdminUserRecord, AdminUsersMetric } from "./types";

function AdminUsersMetricGrid({
  metrics,
}: Readonly<{ metrics: ReadonlyArray<AdminUsersMetric> }>) {
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

function AdminUsersMobileList({
  records,
}: Readonly<{ records: ReadonlyArray<AdminUserRecord> }>) {
  return (
    <div className="grid gap-3 lg:hidden">
      {records.map((record) => (
        <Card key={record.id}>
          <CardContent className="grid gap-4 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-title-sm text-foreground font-semibold">
                  {record.name}
                </p>
                <p className="text-body-sm text-text-secondary">
                  {record.email}
                </p>
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  {record.plan} · {record.branch}
                </p>
              </div>
              <BorrowStatusBadge
                label={record.statusLabel}
                tone={record.statusTone}
              />
            </div>

            <div className="grid gap-3 rounded-2xl border border-dashed border-black/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-body-sm text-text-secondary">
                  Borrowing
                </span>
                <span className="text-body-sm text-foreground font-medium">
                  {record.activeLoans}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-body-sm text-text-secondary">
                  Balance
                </span>
                <span className="text-body-sm text-foreground font-medium">
                  {record.balanceLabel}
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminUsersDesktopTable({
  records,
}: Readonly<{ records: ReadonlyArray<AdminUserRecord> }>) {
  return (
    <div className="hidden lg:block">
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>Member</AdminTableHead>
            <AdminTableHead>Borrowing</AdminTableHead>
            <AdminTableHead>Balance</AdminTableHead>
            <AdminTableHead>Payment</AdminTableHead>
            <AdminTableHead>Status</AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {records.map((record) => (
            <AdminTableRow key={record.id}>
              <AdminTableCell>
                <div className="space-y-1.5">
                  <p className="text-body text-foreground font-medium">
                    {record.name}
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    {record.email}
                  </p>
                  <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                    {record.plan} · {record.branch}
                  </p>
                </div>
              </AdminTableCell>
              <AdminTableCell className="text-body-sm text-text-secondary">
                {record.activeLoans}
              </AdminTableCell>
              <AdminTableCell className="text-body-sm text-text-secondary">
                {record.balanceLabel}
              </AdminTableCell>
              <AdminTableCell>
                <BorrowStatusBadge
                  label={record.paymentLabel}
                  tone={record.paymentTone}
                />
              </AdminTableCell>
              <AdminTableCell>
                <BorrowStatusBadge
                  label={record.statusLabel}
                  tone={record.statusTone}
                />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}

function AdminUsersEmptyState() {
  return (
    <EmptyState
      size="sm"
      title="No members match the current filters"
      description="Adjust the member filter or search term. The admin users view is still powered by local mock data only."
    />
  );
}

export {
  AdminUsersDesktopTable,
  AdminUsersEmptyState,
  AdminUsersMetricGrid,
  AdminUsersMobileList,
};
