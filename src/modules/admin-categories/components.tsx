import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  KpiCard,
} from "@/components/admin";
import { BorrowStatusBadge } from "@/components/library";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  AdminCategoriesMetric,
  AdminCategoryPlanningItem,
  AdminCategoryRecord,
} from "./types";

function AdminCategoriesMetricGrid({
  metrics,
}: Readonly<{ metrics: ReadonlyArray<AdminCategoriesMetric> }>) {
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

function AdminCategoriesCards({
  records,
}: Readonly<{ records: ReadonlyArray<AdminCategoryRecord> }>) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>{record.name}</CardTitle>
                <CardDescription>
                  {record.shelfCode} · {record.titles}
                </CardDescription>
              </div>
              <BorrowStatusBadge
                label={record.statusLabel}
                tone={record.statusTone}
              />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-dashed border-black/5 p-3">
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Active loans
                </p>
                <p className="text-body text-foreground mt-1 font-medium">
                  {record.activeLoans}
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-black/5 p-3">
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Typical fee
                </p>
                <p className="text-body text-foreground mt-1 font-medium">
                  {record.averageFee}
                </p>
              </div>
            </div>
            <p className="text-body-sm text-text-secondary">
              {record.curationNote}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminCategoriesTable({
  records,
}: Readonly<{ records: ReadonlyArray<AdminCategoryRecord> }>) {
  return (
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
              <BorrowStatusBadge
                label={record.statusLabel}
                tone={record.statusTone}
              />
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  );
}

function AdminCategoriesPlanningList({
  items,
}: Readonly<{ items: ReadonlyArray<AdminCategoryPlanningItem> }>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Planning queue</CardTitle>
        <CardDescription>
          Static planning tasks that show how category operations can be
          decomposed into reusable sections.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
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
      </CardContent>
    </Card>
  );
}

export {
  AdminCategoriesCards,
  AdminCategoriesMetricGrid,
  AdminCategoriesPlanningList,
  AdminCategoriesTable,
};
