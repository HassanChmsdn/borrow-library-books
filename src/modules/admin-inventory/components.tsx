import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  KpiCard,
} from "@/components/admin";
import { AvailabilityBadge, BorrowStatusBadge } from "@/components/library";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  AdminInventoryAlertItem,
  AdminInventoryBranchCard,
  AdminInventoryMetric,
  AdminInventoryRecord,
} from "./types";

function formatInventoryAvailabilityLabel(record: AdminInventoryRecord) {
  return `${record.availableCopies}/${record.totalCopies} available`;
}

function AdminInventoryMetricGrid({
  metrics,
}: Readonly<{ metrics: ReadonlyArray<AdminInventoryMetric> }>) {
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

function AdminInventoryAlerts({
  alerts,
}: Readonly<{ alerts: ReadonlyArray<AdminInventoryAlertItem> }>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory alerts</CardTitle>
        <CardDescription>
          Presentational alerts for stock health and transfer planning.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-2xl border border-dashed border-black/5 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-body text-foreground font-medium">
                {alert.title}
              </p>
              <BorrowStatusBadge label={alert.tone} tone={alert.tone} />
            </div>
            <p className="text-body-sm text-text-secondary mt-2">
              {alert.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AdminInventoryBranchGrid({
  items,
}: Readonly<{ items: ReadonlyArray<AdminInventoryBranchCard> }>) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.branch}</CardTitle>
            <CardDescription>{item.note}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-dashed border-black/5 p-3">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Shelf health
              </p>
              <p className="text-body text-foreground mt-1 font-medium">
                {item.healthyShelves}
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-black/5 p-3">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Review items
              </p>
              <p className="text-body text-foreground mt-1 font-medium">
                {item.reviewItems}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminInventoryTable({
  records,
}: Readonly<{ records: ReadonlyArray<AdminInventoryRecord> }>) {
  return (
    <AdminTable>
      <AdminTableHeader>
        <AdminTableRow>
          <AdminTableHead>Title</AdminTableHead>
          <AdminTableHead>Availability</AdminTableHead>
          <AdminTableHead>Action</AdminTableHead>
          <AdminTableHead>Audit</AdminTableHead>
        </AdminTableRow>
      </AdminTableHeader>
      <AdminTableBody>
        {records.map((record) => (
          <AdminTableRow key={record.id}>
            <AdminTableCell>
              <div className="space-y-1.5">
                <p className="text-body text-foreground font-medium">
                  {record.title}
                </p>
                <p className="text-body-sm text-text-secondary">
                  {record.branch} · {record.shelfCode}
                </p>
              </div>
            </AdminTableCell>
            <AdminTableCell>
              <AvailabilityBadge
                label={formatInventoryAvailabilityLabel(record)}
                tone={record.availabilityTone}
              />
            </AdminTableCell>
            <AdminTableCell>
              <BorrowStatusBadge
                label={record.nextAction}
                tone={record.actionTone}
              />
            </AdminTableCell>
            <AdminTableCell className="text-body-sm text-text-secondary">
              {record.lastAudit}
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  );
}

export {
  AdminInventoryAlerts,
  AdminInventoryBranchGrid,
  AdminInventoryMetricGrid,
  AdminInventoryTable,
};
