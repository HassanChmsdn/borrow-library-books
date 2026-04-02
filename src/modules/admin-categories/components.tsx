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

import type {
  AdminCategoriesMetric,
  AdminCategoryPlanningItem,
  AdminCategoryRecord,
} from "./types";

function AdminCategoriesMetricGrid({
  metrics,
}: Readonly<{ metrics: ReadonlyArray<AdminCategoriesMetric> }>) {
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

function AdminCategoriesCards({
  records,
}: Readonly<{ records: ReadonlyArray<AdminCategoryRecord> }>) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {records.map((record) => (
        <AdminSectionCard
          key={record.id}
          title={record.name}
          description={`${record.shelfCode} · ${record.titles}`}
          actions={
            <AdminStatusBadge
              label={record.statusLabel}
              tone={record.statusTone}
            />
          }
        >
          <AdminDetailSection
            columns={2}
            items={[
              { label: "Active loans", value: record.activeLoans },
              { label: "Typical fee", value: record.averageFee },
            ]}
          />
          <p className="text-body-sm text-text-secondary">
            {record.curationNote}
          </p>
        </AdminSectionCard>
      ))}
    </div>
  );
}

function AdminCategoriesTable({
  records,
}: Readonly<{ records: ReadonlyArray<AdminCategoryRecord> }>) {
  return (
    <AdminDataTable>
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>Category</AdminTableHead>
            <AdminTableHead>Loans</AdminTableHead>
            <AdminTableHead>Fee</AdminTableHead>
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
                    {record.shelfCode} · {record.titles}
                  </p>
                </div>
              </AdminTableCell>
              <AdminTableCell className="text-body-sm text-text-secondary">
                {record.activeLoans}
              </AdminTableCell>
              <AdminTableCell className="text-body-sm text-text-secondary">
                {record.averageFee}
              </AdminTableCell>
              <AdminTableCell>
                <AdminStatusBadge
                  label={record.statusLabel}
                  tone={record.statusTone}
                />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </AdminDataTable>
  );
}

function AdminCategoriesPlanningList({
  items,
}: Readonly<{ items: ReadonlyArray<AdminCategoryPlanningItem> }>) {
  return (
    <AdminSectionCard
      title="Planning queue"
      description={
        <>
          Static planning tasks that show how category operations can be
          decomposed into reusable sections.
        </>
      }
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-dashed border-black/5 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-body text-foreground font-medium">
              {item.title}
            </p>
            <span className="text-caption text-text-tertiary">
              {item.dueLabel}
            </span>
          </div>
          <p className="text-body-sm text-text-secondary mt-2">
            {item.description}
          </p>
        </div>
      ))}
    </AdminSectionCard>
  );
}

export {
  AdminCategoriesCards,
  AdminCategoriesMetricGrid,
  AdminCategoriesPlanningList,
  AdminCategoriesTable,
};
