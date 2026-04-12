import { adminSharedCategories } from "@/modules/admin-shared/mock-data";

import type { AdminSharedMarkerTone } from "@/modules/admin-shared/types";

export interface CategoryRepositoryRecord {
  description: string;
  iconKey: string;
  id: string;
  markerTone: AdminSharedMarkerTone;
  name: string;
  slug: string;
}

const categoryRecords: ReadonlyArray<CategoryRepositoryRecord> = adminSharedCategories.map(
  (category) => ({
    ...category,
    slug: category.id,
  }),
);

export function listCategoryRecords() {
  return categoryRecords;
}

export function getCategoryRecordById(categoryId: string) {
  return categoryRecords.find((category) => category.id === categoryId) ?? null;
}