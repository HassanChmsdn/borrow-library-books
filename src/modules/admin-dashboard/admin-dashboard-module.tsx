import Link from "next/link";

import { LoadingSkeleton } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";

import {
  AdminDashboardActivitySection,
  AdminDashboardAlertsSection,
  AdminDashboardBranchPulseGrid,
  AdminDashboardMetricGrid,
  AdminDashboardQueueSection,
} from "./components";
import { getAdminDashboardModuleData } from "./hooks";

function AdminDashboardModule() {
  const { activity, alerts, branchPulse, metrics, queue } =
    getAdminDashboardModuleData();

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Dashboard"
        title="Library operations snapshot"
        description="A mobile-first overview of circulation, collection health, and branch activity using typed mock data and reusable admin primitives."
        actions={
          <>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/borrowings">Review queue</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/books">Open catalog</Link>
            </Button>
          </>
        }
      />

      <AdminDashboardMetricGrid metrics={metrics} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.9fr)]">
        <AdminDashboardQueueSection queue={queue} />
        <AdminDashboardAlertsSection alerts={alerts} />
      </div>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-title-sm text-foreground font-semibold">
            Branch pulse
          </h2>
          <p className="text-body-sm text-text-secondary max-w-3xl">
            A shared card rhythm for branch-level operational context that can
            later swap to real analytics endpoints.
          </p>
        </div>
        <AdminDashboardBranchPulseGrid items={branchPulse} />
      </section>

      <AdminDashboardActivitySection items={activity} />
    </div>
  );
}

function AdminDashboardLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Dashboard"
        title="Library operations snapshot"
        description="Loading admin overview surfaces."
      />
      <LoadingSkeleton count={4} variant="card" className="xl:grid-cols-4" />
      <LoadingSkeleton count={2} variant="table" className="xl:grid-cols-2" />
      <LoadingSkeleton count={3} variant="card" className="xl:grid-cols-3" />
    </div>
  );
}

export { AdminDashboardLoadingState, AdminDashboardModule };
