import {
  adminCategoriesMetrics,
  adminCategoriesPlanningItems,
  adminCategoriesRecords,
} from "./data";

export function getAdminCategoriesModuleData() {
  return {
    metrics: adminCategoriesMetrics,
    planningItems: adminCategoriesPlanningItems,
    records: adminCategoriesRecords,
  };
}
