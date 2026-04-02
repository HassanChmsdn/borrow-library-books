import {
  adminDashboardActivity,
  adminDashboardMetrics,
  adminDashboardNotices,
  adminDashboardQuickActions,
  adminDashboardTrendPoints,
  adminDashboardTrendSummary,
} from "./data";

export function getAdminDashboardModuleData() {
  return {
    activity: adminDashboardActivity,
    metrics: adminDashboardMetrics,
    notices: adminDashboardNotices,
    quickActions: adminDashboardQuickActions,
    trendPoints: adminDashboardTrendPoints,
    trendSummary: adminDashboardTrendSummary,
  };
}
