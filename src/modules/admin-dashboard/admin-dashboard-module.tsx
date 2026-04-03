import Link from "next/link";

import { AdminEmptyState, AdminPageHeader } from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { Button } from "@/components/ui/button";

import {
  AdminDashboardActivitySection,
  AdminDashboardMetricGrid,
  AdminDashboardNoticeSection,
  AdminDashboardQuickActionsSection,
  AdminDashboardTrendSection,
} from "./components";
import { getAdminDashboardModuleData } from "./hooks";

function AdminDashboardModule() {
  const { activity, metrics, notices, quickActions, trendPoints, trendSummary } =
    getAdminDashboardModuleData();

  const hasDashboardContent =
    activity.length > 0 ||
    metrics.length > 0 ||
    notices.length > 0 ||
    quickActions.length > 0 ||
    trendPoints.length > 0 ||
    trendSummary.length > 0;

  if (!hasDashboardContent) {
    return <AdminDashboardEmptyState />;
  }

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Library operations dashboard"
        description="A production-oriented overview of pending circulation work, active borrowing pressure, overdue follow-up, cash fee intake, and member activity using typed mock data."
        actions={
          <>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/borrowings">Review borrowings</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/inventory">Open inventory</Link>
            </Button>
          </>
        }
      />

      <AdminDashboardMetricGrid metrics={metrics} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.92fr)] xl:items-start">
        <div className="order-2 space-y-6 xl:order-1">
          <AdminDashboardTrendSection
            points={trendPoints}
            summary={trendSummary}
          />
          <AdminDashboardActivitySection items={activity} />
        </div>

        <div className="order-1 space-y-6 xl:order-2">
          <AdminDashboardNoticeSection notices={notices} />
          <AdminDashboardQuickActionsSection actions={quickActions} />
        </div>
      </div>
    </div>
  );
}

function AdminDashboardEmptyState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Library operations dashboard"
        description="The dashboard is ready, but there is no operational mock data to summarize yet. Reconnect the derived dataset or seed new records to repopulate this overview."
      />

      <AdminEmptyState
        title="No dashboard data available"
        description="KPI cards, notices, trends, and recent activity will appear here once the admin data source contains operational records again."
        action={
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/books">Open books management</Link>
          </Button>
        }
      />
    </div>
  );
}

function AdminDashboardLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Library operations dashboard"
        description="Loading admin overview surfaces."
      />
      <LoadingSkeleton count={5} variant="kpi" className="xl:grid-cols-5" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.92fr)]">
        <div className="space-y-6">
          <LoadingSkeleton count={1} variant="table" />
          <LoadingSkeleton count={1} variant="table" />
        </div>
        <div className="space-y-6">
          <LoadingSkeleton count={2} variant="card" />
          <LoadingSkeleton count={3} variant="card" />
        </div>
      </div>
    </div>
  );
}

export { AdminDashboardLoadingState, AdminDashboardModule };
