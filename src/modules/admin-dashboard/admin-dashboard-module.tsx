import { AdminEmptyState, AdminPageHeader } from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { LinkButton } from "@/components/ui/link-button";
import { getI18n } from "@/lib/i18n/server";

import {
  AdminDashboardActivitySection,
  AdminDashboardMetricGrid,
  AdminDashboardNoticeSection,
  AdminDashboardQuickActionsSection,
  AdminDashboardTrendSection,
} from "./components";
import type {
  AdminDashboardActivityItem,
  AdminDashboardMetric,
  AdminDashboardNoticeItem,
  AdminDashboardQuickAction,
  AdminDashboardTrendPoint,
  AdminDashboardTrendSummaryItem,
} from "./types";

interface AdminDashboardModuleProps {
  data: {
    activity: ReadonlyArray<AdminDashboardActivityItem>;
    availableSections: {
      books: boolean;
      borrowings: boolean;
      inventory: boolean;
    };
    metrics: ReadonlyArray<AdminDashboardMetric>;
    notices: ReadonlyArray<AdminDashboardNoticeItem>;
    quickActions: ReadonlyArray<AdminDashboardQuickAction>;
    trendPoints: ReadonlyArray<AdminDashboardTrendPoint>;
    trendSummary: ReadonlyArray<AdminDashboardTrendSummaryItem>;
  };
}

async function AdminDashboardModule({ data }: Readonly<AdminDashboardModuleProps>) {
  const { formatMessage, translateText } = await getI18n();
  const {
    activity,
    availableSections,
    metrics,
    notices,
    quickActions,
    trendPoints,
    trendSummary,
  } = data;

  const hasDashboardContent =
    activity.length > 0 ||
    metrics.length > 0 ||
    notices.length > 0 ||
    quickActions.length > 0 ||
    trendPoints.length > 0 ||
    trendSummary.length > 0;

  if (!hasDashboardContent) {
    return <AdminDashboardEmptyState availableSections={availableSections} />;
  }

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Library operations dashboard"
        description="A production-oriented overview of pending circulation work, active borrowing pressure, overdue follow-up, cash fee intake, and member activity."
        actions={
          <>
            {availableSections.borrowings ? (
              <LinkButton href="/admin/borrowings" size="sm" variant="outline">
                Review borrowings
              </LinkButton>
            ) : null}
            {availableSections.inventory ? (
              <LinkButton href="/admin/inventory" size="sm">
                Open inventory
              </LinkButton>
            ) : null}
          </>
        }
      />

      <AdminDashboardMetricGrid metrics={metrics} translateText={translateText} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.92fr)] xl:items-start">
        <div className="order-2 space-y-6 xl:order-1">
          <AdminDashboardTrendSection
            formatMessage={formatMessage}
            points={trendPoints}
            summary={trendSummary}
            translateText={translateText}
          />
          <AdminDashboardActivitySection items={activity} translateText={translateText} />
        </div>

        <div className="order-1 space-y-6 xl:order-2">
          <AdminDashboardNoticeSection notices={notices} translateText={translateText} />
          <AdminDashboardQuickActionsSection actions={quickActions} translateText={translateText} />
        </div>
      </div>
    </div>
  );
}

function AdminDashboardEmptyState({
  availableSections,
}: Readonly<{
  availableSections: {
    books: boolean;
    borrowings: boolean;
    inventory: boolean;
  };
}>) {
  const emptyStateHref = availableSections.books
    ? "/admin/books"
    : availableSections.borrowings
      ? "/admin/borrowings"
      : availableSections.inventory
        ? "/admin/inventory"
        : null;
  const emptyStateLabel = availableSections.books
    ? "Open books management"
    : availableSections.borrowings
      ? "Open borrowings"
      : availableSections.inventory
        ? "Open inventory"
        : null;

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
        action={emptyStateHref && emptyStateLabel ? (
          <LinkButton href={emptyStateHref} size="sm" variant="outline">
            {emptyStateLabel}
          </LinkButton>
        ) : undefined}
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
