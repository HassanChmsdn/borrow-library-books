import {
  countBookRecordsByCategory,
  listCategoryRecords,
} from "@/lib/data";

import type {
  AdminCategoryFormValues,
  AdminCategoryRecord,
} from "./types";

export const adminCategoryRecords: ReadonlyArray<AdminCategoryRecord> =
  listCategoryRecords().map((category) => ({
    bookCount: countBookRecordsByCategory(category.id),
    description: category.description,
    id: category.id,
    name: category.name,
  }));

export function getAdminCategoryDefaultValues(
  record?: AdminCategoryRecord,
): AdminCategoryFormValues {
  return {
    description: record?.description ?? "",
    name: record?.name ?? "",
  };
}

export function createAdminCategoryId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}