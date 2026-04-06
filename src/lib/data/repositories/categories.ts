import { adminSharedCategories } from "@/modules/admin-shared/mock-data";

import type { AdminSharedCategoryRecord } from "@/modules/admin-shared/types";

export interface CategoryRepositoryRecord extends AdminSharedCategoryRecord {
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