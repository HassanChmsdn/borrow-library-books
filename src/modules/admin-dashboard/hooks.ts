import {
  adminDashboardActivity,
  adminDashboardAlerts,
  adminDashboardBranchPulse,
  adminDashboardMetrics,
  adminDashboardQueue,
} from "./data";

export function getAdminDashboardModuleData() {
  return {
    activity: adminDashboardActivity,
    alerts: adminDashboardAlerts,
    branchPulse: adminDashboardBranchPulse,
    metrics: adminDashboardMetrics,
    queue: adminDashboardQueue,
  };
}
