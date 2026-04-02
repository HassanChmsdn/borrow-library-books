import { ArrowRight } from "lucide-react";

import {
  AdminDetailSection,
  AdminEmptyState,
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
import { Button } from "@/components/ui/button";

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
    <AdminMetricStrip
      items={metrics.map((metric) => {
        const Icon = metric.icon;

        return {
          icon: <Icon aria-hidden="true" className="size-4" />,
          label: metric.label,
          supportingText: metric.supportingText,
          trend: metric.trend,
          value: metric.value,
        };
      })}
    />
  );
}

function AdminDashboardQueueSection({
  queue,
}: Readonly<{ queue: ReadonlyArray<AdminDashboardQueueItem> }>) {
  return (
    <AdminSectionCard
      title="Circulation queue"
      description={
        <>
          A responsive queue surface for approvals, reminders, and assignment
          work.
        </>
      }
    >
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
                  <AdminStatusBadge
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
                      <AdminStatusBadge
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
        <AdminEmptyState
          title="No items in the queue"
          description="Request approvals and reminder tasks will appear here when circulation workflows are connected."
        />
      )}
    </AdminSectionCard>
  );
}

function AdminDashboardAlertsSection({
  alerts,
}: Readonly<{ alerts: ReadonlyArray<AdminDashboardAlertItem> }>) {
  return (
    <AdminSectionCard
      title="Collection alerts"
      description={
        <>
          Quick signal cards for the stock and demand patterns surfaced in the
          design.
        </>
      }
    >
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-card border-border-subtle bg-elevated grid gap-2 border p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-body text-foreground font-medium">
              {alert.title}
            </p>
            <AdminStatusBadge label={alert.tone} tone={alert.tone} />
          </div>
          <p className="text-body-sm text-text-secondary">
            {alert.description}
          </p>
          <p className="text-caption text-text-tertiary">{alert.meta}</p>
        </div>
      ))}
    </AdminSectionCard>
  );
}

function AdminDashboardBranchPulseGrid({
  items,
}: Readonly<{ items: ReadonlyArray<AdminDashboardBranchPulse> }>) {
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
              { label: "Handoffs", value: item.handoffs },
              { label: "Active loans", value: item.activeLoans },
              { label: "Low stock", value: item.lowStockTitles },
            ]}
          />
        </AdminSectionCard>
      ))}
    </div>
  );
}

function AdminDashboardActivitySection({
  items,
}: Readonly<{ items: ReadonlyArray<AdminDashboardActivityItem> }>) {
  return (
    <AdminSectionCard
      title="Recent activity"
      description={
        <>
          Static activity rows showing how a denser admin summary can fit on
          desktop.
        </>
      }
      footer={
        <Button type="button" variant="ghost" className="justify-between">
          View full activity log
          <ArrowRight className="size-4" />
        </Button>
      }
    >
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
          <AdminStatusBadge label={item.statusLabel} tone={item.statusTone} />
        </div>
      ))}
    </AdminSectionCard>
  );
}

export {
  AdminDashboardActivitySection,
  AdminDashboardAlertsSection,
  AdminDashboardBranchPulseGrid,
  AdminDashboardMetricGrid,
  AdminDashboardQueueSection,
};
