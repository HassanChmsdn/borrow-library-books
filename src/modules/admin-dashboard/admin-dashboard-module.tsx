import Link from "next/link";
import { BookCopy, FolderKanban, PackageOpen } from "lucide-react";

import { AdminPageHeader, AdminQuickActionCard } from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
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

  const quickActions = [
    {
      actionLabel: "Open queue",
      description:
        "Move straight into pending pickups and due-soon follow-ups.",
      href: "/admin/borrowings",
      icon: <BookCopy aria-hidden="true" className="size-4" />,
      title: "Circulation focus",
    },
    {
      actionLabel: "Review books",
      description: "Check catalog records, fees, and availability changes.",
      href: "/admin/books",
      icon: <PackageOpen aria-hidden="true" className="size-4" />,
      title: "Catalog upkeep",
    },
    {
      actionLabel: "Plan categories",
      description:
        "Adjust category mix and curation notes without leaving the admin frame.",
      href: "/admin/categories",
      icon: <FolderKanban aria-hidden="true" className="size-4" />,
      title: "Collection planning",
    },
  ] as const;

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
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

      <div className="grid gap-4 xl:grid-cols-3">
        {quickActions.map((item) => (
          <AdminQuickActionCard key={item.title} {...item} />
        ))}
      </div>

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
      <AdminPageHeader
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
