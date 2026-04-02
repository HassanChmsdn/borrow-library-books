import {
  AdminDataTable,
  AdminDetailSection,
  AdminMetricStrip,
  AdminSectionCard,
  AdminStatusBadge,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin";
import { AvailabilityBadge } from "@/components/library";

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

function AdminInventoryAlerts({
  alerts,
}: Readonly<{ alerts: ReadonlyArray<AdminInventoryAlertItem> }>) {
  return (
    <AdminSectionCard
      title="Inventory alerts"
      description={
        <>Presentational alerts for stock health and transfer planning.</>
      }
    >
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-2xl border border-dashed border-black/5 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-body text-foreground font-medium">
              {alert.title}
            </p>
            <AdminStatusBadge label={alert.tone} tone={alert.tone} />
          </div>
          <p className="text-body-sm text-text-secondary mt-2">
            {alert.description}
          </p>
        </div>
      ))}
    </AdminSectionCard>
  );
}

function AdminInventoryBranchGrid({
  items,
}: Readonly<{ items: ReadonlyArray<AdminInventoryBranchCard> }>) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {items.map((item) => (
        <AdminSectionCard
          key={item.id}
          title={item.branch}
          description={item.note}
        >
          <AdminDetailSection
            columns={2}
            items={[
              { label: "Shelf health", value: item.healthyShelves },
              { label: "Review items", value: item.reviewItems },
            ]}
          />
        </AdminSectionCard>
      ))}
    </div>
  );
}

function AdminInventoryTable({
  records,
}: Readonly<{ records: ReadonlyArray<AdminInventoryRecord> }>) {
  return (
    <AdminDataTable>
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
                <AdminStatusBadge
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
    </AdminDataTable>
  );
}

export {
  AdminInventoryAlerts,
  AdminInventoryBranchGrid,
  AdminInventoryMetricGrid,
  AdminInventoryTable,
};
