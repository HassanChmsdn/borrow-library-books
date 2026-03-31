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
              <Card key={metric.label}>
                <CardHeader className="gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                      {metric.label}
                    </p>
                    <span className="bg-secondary text-primary flex size-10 items-center justify-center rounded-xl">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <p className="text-title-lg text-foreground font-semibold">
                      {metric.value}
                    </p>
                    <p className="text-body-sm text-text-secondary mt-1">
                      {metric.supportingText}
                    </p>
                  </div>
                </CardHeader>
              </Card>
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
          <CardContent className="grid gap-3">
            {borrowRequestQueue.map((item) => (
              <div
                key={item.title}
                className="border-border-subtle bg-elevated rounded-xl border px-4 py-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-body text-foreground font-medium">
                      {item.title}
                    </p>
                    <p className="text-body-sm text-text-secondary mt-1">
                      {item.description}
                    </p>
                  </div>
                  <span className="bg-secondary text-primary text-caption rounded-pill inline-flex px-2.5 py-1 font-medium tracking-[0.18em] uppercase">
                    {item.status}
                  </span>
                </div>
                <p className="text-caption text-text-tertiary mt-3">
                  {item.meta}
                </p>
              </div>
            ))}
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
          <CardContent className="grid gap-3 md:grid-cols-3">
            {memberSignals.map((item) => (
              <div
                key={item.title}
                className="border-border-subtle bg-elevated rounded-xl border px-4 py-4"
              >
                <p className="text-body text-foreground font-medium">
                  {item.title}
                </p>
                <p className="text-body-sm text-text-secondary mt-2">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-caption text-text-tertiary">
                    {item.meta}
                  </span>
                  <span className="bg-muted text-text-secondary text-caption rounded-pill inline-flex px-2.5 py-1 font-medium tracking-[0.18em] uppercase">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export { AdminOverviewModule };
