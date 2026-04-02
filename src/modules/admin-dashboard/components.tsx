import { ArrowRight } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  AdminDashboardActivityItem,
  AdminDashboardAlertItem,
  AdminDashboardBranchPulse,
  AdminDashboardMetric,
  AdminDashboardQueueItem,
} from "./types";

function AdminDashboardMetricGrid({
  metrics,
}: Readonly<{ metrics: ReadonlyArray<AdminDashboardMetric> }>) {
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
            trend={metric.trend}
            value={metric.value}
          />
        );
      })}
    </div>
  );
}

function AdminDashboardQueueSection({
  queue,
}: Readonly<{ queue: ReadonlyArray<AdminDashboardQueueItem> }>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Circulation queue</CardTitle>
        <CardDescription>
          A responsive queue surface for approvals, reminders, and assignment
          work.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {queue.length > 0 ? (
          <>
            <div className="grid gap-3 md:hidden">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="rounded-card border-border-subtle bg-card grid gap-3 border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-body text-foreground font-medium">
                        {item.title}
                      </p>
                      <p className="text-body-sm text-text-secondary">
                        {item.member} · {item.branch}
                      </p>
                    </div>
                    <BorrowStatusBadge
                      label={item.statusLabel}
                      tone={item.statusTone}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-body-sm text-text-secondary">
                      {item.submittedAt}
                    </p>
                    <p className="text-body-sm text-foreground font-medium">
                      {item.dueLabel}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <AdminTable>
                <AdminTableHeader>
                  <AdminTableRow>
                    <AdminTableHead>Request</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead>Timing</AdminTableHead>
                  </AdminTableRow>
                </AdminTableHeader>
                <AdminTableBody>
                  {queue.map((item) => (
                    <AdminTableRow key={item.id}>
                      <AdminTableCell>
                        <div className="space-y-1.5">
                          <p className="text-body text-foreground font-medium">
                            {item.title}
                          </p>
                          <p className="text-body-sm text-text-secondary">
                            {item.member} · {item.branch}
                          </p>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell>
                        <BorrowStatusBadge
                          label={item.statusLabel}
                          tone={item.statusTone}
                        />
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="space-y-1">
                          <p className="text-body-sm text-foreground font-medium">
                            {item.dueLabel}
                          </p>
                          <p className="text-body-sm text-text-secondary">
                            {item.submittedAt}
                          </p>
                        </div>
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            </div>
          </>
        ) : (
          <EmptyState
            size="sm"
            title="No items in the queue"
            description="Request approvals and reminder tasks will appear here when circulation workflows are connected."
          />
        )}
      </CardContent>
    </Card>
  );
}

function AdminDashboardAlertsSection({
  alerts,
}: Readonly<{ alerts: ReadonlyArray<AdminDashboardAlertItem> }>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection alerts</CardTitle>
        <CardDescription>
          Quick signal cards for the stock and demand patterns surfaced in the
          design.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-card border-border-subtle bg-elevated grid gap-2 border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-body text-foreground font-medium">
                {alert.title}
              </p>
              <BorrowStatusBadge label={alert.tone} tone={alert.tone} />
            </div>
            <p className="text-body-sm text-text-secondary">
              {alert.description}
            </p>
            <p className="text-caption text-text-tertiary">{alert.meta}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AdminDashboardBranchPulseGrid({
  items,
}: Readonly<{ items: ReadonlyArray<AdminDashboardBranchPulse> }>) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.branch}</CardTitle>
            <CardDescription>{item.note}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-2xl border border-dashed border-black/5 p-3">
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Handoffs
                </p>
                <p className="text-body text-foreground mt-1 font-medium">
                  {item.handoffs}
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-black/5 p-3">
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Active loans
                </p>
                <p className="text-body text-foreground mt-1 font-medium">
                  {item.activeLoans}
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-black/5 p-3">
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Low stock
                </p>
                <p className="text-body text-foreground mt-1 font-medium">
                  {item.lowStockTitles}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminDashboardActivitySection({
  items,
}: Readonly<{ items: ReadonlyArray<AdminDashboardActivityItem> }>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>
          Static activity rows showing how a denser admin summary can fit on
          desktop.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-2xl border border-dashed border-black/5 p-4"
          >
            <div className="space-y-1">
              <p className="text-body text-foreground font-medium">
                {item.title}
              </p>
              <p className="text-body-sm text-text-secondary">{item.meta}</p>
            </div>
            <BorrowStatusBadge
              label={item.statusLabel}
              tone={item.statusTone}
            />
          </div>
        ))}

        <Button type="button" variant="ghost" className="justify-between">
          View full activity log
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export {
  AdminDashboardActivitySection,
  AdminDashboardAlertsSection,
  AdminDashboardBranchPulseGrid,
  AdminDashboardMetricGrid,
  AdminDashboardQueueSection,
};
