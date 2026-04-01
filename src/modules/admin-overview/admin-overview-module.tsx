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
import { cn } from "@/lib/utils";

import {
  adminMetrics,
  borrowRequestQueue,
  inventoryNotes,
  memberSignals,
} from "./data";

const statusToneClasses = {
  success: "border-success-border bg-success-surface text-success",
  warning: "border-warning-border bg-warning-surface text-warning",
  danger: "border-danger-border bg-danger-surface text-danger",
  info: "border-info-border bg-info-surface text-info",
} as const;

const queueToneMap = {
  Eligible: "success",
  "Needs assignment": "warning",
  "Send reminder": "info",
} as const;

const memberSignalToneMap = {
  Healthy: "success",
  Stable: "info",
  Opportunity: "warning",
} as const;

function AdminOverviewModule() {
  return (
    <div className="gap-section flex flex-col">
      <section
        id="overview"
        aria-labelledby="admin-overview-title"
        className="space-y-4"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="admin-overview-title"
              className="text-title text-foreground font-heading font-semibold"
            >
              Library operations overview
            </h2>
            <p className="text-body text-text-secondary max-w-3xl">
              Static module scaffolding for future admin dashboards, request
              queues, and inventory workflows.
            </p>
          </div>

          <p className="text-label text-text-tertiary font-medium tracking-[0.18em] uppercase">
            Layout-ready module
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminMetrics.map((metric) => {
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
      </section>

      <section
        id="borrow-requests"
        aria-labelledby="borrow-requests-title"
        className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]"
      >
        <Card>
          <CardHeader>
            <CardTitle id="borrow-requests-title">Borrow requests</CardTitle>
            <CardDescription>
              Presentational queue surfaces that can later connect to real
              request workflows without changing the admin shell.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {borrowRequestQueue.length > 0 ? (
              <AdminTable>
                <AdminTableHeader>
                  <AdminTableRow>
                    <AdminTableHead>Request</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                    <AdminTableHead>Timing</AdminTableHead>
                  </AdminTableRow>
                </AdminTableHeader>
                <AdminTableBody>
                  {borrowRequestQueue.map((item) => (
                    <AdminTableRow key={item.title}>
                      <AdminTableCell>
                        <p className="text-body text-foreground font-medium">
                          {item.title}
                        </p>
                        <p className="text-body-sm text-text-secondary mt-1">
                          {item.description}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell>
                        <BorrowStatusBadge
                          label={item.status}
                          tone={
                            queueToneMap[
                              item.status as keyof typeof queueToneMap
                            ]
                          }
                        />
                      </AdminTableCell>
                      <AdminTableCell className="text-body-sm text-text-secondary">
                        {item.meta}
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            ) : (
              <EmptyState
                description="Pending borrow requests can render here once the queue is connected."
                size="sm"
                title="No borrow requests yet"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Queue actions</CardTitle>
            <CardDescription>
              Static control surfaces that preview how page-level actions sit
              inside the module canvas.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button type="button">Assign copies</Button>
            <Button type="button" variant="secondary">
              Review holds
            </Button>
            <Button type="button" variant="outline">
              Export snapshot
            </Button>
          </CardContent>
        </Card>
      </section>

      <section
        id="inventory"
        aria-labelledby="inventory-title"
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]"
      >
        <Card>
          <CardHeader>
            <CardTitle id="inventory-title">Inventory signals</CardTitle>
            <CardDescription>
              Low-stock and collection-health notes now live in a feature module
              instead of route-local preview cards.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {inventoryNotes.map((item) => (
              <div
                key={item.title}
                className="border-border-subtle bg-card rounded-xl border px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-body text-foreground font-medium">
                    {item.title}
                  </p>
                  <span
                    className={cn(
                      "text-caption rounded-pill inline-flex border px-2.5 py-1 font-medium tracking-[0.18em] uppercase",
                      statusToneClasses[item.tone],
                    )}
                  >
                    {item.tone}
                  </span>
                </div>
                <p className="text-body-sm text-text-secondary mt-2">
                  {item.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-secondary border-transparent">
          <CardHeader>
            <CardTitle>Collection health</CardTitle>
            <CardDescription>
              These summary notes are intentionally static and exist to
              establish the module rhythm only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-body-sm text-text-secondary">
              High-demand titles can surface here before collection logic and
              alerts are implemented.
            </p>
            <p className="text-body-sm text-text-secondary">
              The module keeps inventory content separate from the shell so
              future admin pages can swap in real data without rewriting the
              frame.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="members" aria-labelledby="members-title">
        <Card>
          <CardHeader>
            <CardTitle id="members-title">Member signals</CardTitle>
            <CardDescription>
              A static member operations surface for future engagement,
              reminders, and branch planning tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {memberSignals.length > 0 ? (
              <AdminTable>
                <AdminTableHeader>
                  <AdminTableRow>
                    <AdminTableHead>Signal</AdminTableHead>
                    <AdminTableHead>Context</AdminTableHead>
                    <AdminTableHead>Status</AdminTableHead>
                  </AdminTableRow>
                </AdminTableHeader>
                <AdminTableBody>
                  {memberSignals.map((item) => (
                    <AdminTableRow key={item.title}>
                      <AdminTableCell>
                        <p className="text-body text-foreground font-medium">
                          {item.title}
                        </p>
                        <p className="text-body-sm text-text-secondary mt-1">
                          {item.description}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell className="text-body-sm text-text-secondary">
                        {item.meta}
                      </AdminTableCell>
                      <AdminTableCell>
                        <BorrowStatusBadge
                          label={item.status}
                          tone={
                            memberSignalToneMap[
                              item.status as keyof typeof memberSignalToneMap
                            ]
                          }
                        />
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            ) : (
              <EmptyState
                description="Member engagement signals can render here once branch activity is connected."
                size="sm"
                title="No member signals yet"
              />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export { AdminOverviewModule };
