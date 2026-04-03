import {
  adminSharedCategories,
  getAdminSharedBookCountByCategory,
} from "@/modules/admin-shared/mock-data";

import type {
  AdminCategoryFormValues,
  AdminCategoryIconKey,
  AdminCategoryIconOption,
  AdminCategoryMarkerTone,
  AdminCategoryRecord,
} from "./types";

const iconToneMap: Record<AdminCategoryIconKey, AdminCategoryMarkerTone> = {
  "art-design": "danger",
  business: "info",
  fiction: "brand",
  history: "neutral",
  philosophy: "warning",
  science: "info",
  technology: "success",
  travel: "warning",
};

export const adminCategoryIconOptions: ReadonlyArray<AdminCategoryIconOption> = [
  {
    value: "fiction",
    label: "Fiction marker",
    helperText: "Best for literature, novels, and story-led shelves.",
  },
  {
    value: "science",
    label: "Science marker",
    helperText: "Use for research-led or academic knowledge groups.",
  },
  {
    value: "history",
    label: "History marker",
    helperText: "Works well for archives, biographies, and reference history.",
  },
  {
    value: "philosophy",
    label: "Philosophy marker",
    helperText: "Good for reflection, theory, and critical reading shelves.",
  },
  {
    value: "technology",
    label: "Technology marker",
    helperText: "Use for software, engineering, and systems topics.",
  },
  {
    value: "art-design",
    label: "Art and design marker",
    helperText: "Best for creative, visual, and design-oriented collections.",
  },
  {
    value: "business",
    label: "Business marker",
    helperText: "Suitable for operations, leadership, and finance topics.",
  },
  {
    value: "travel",
    label: "Travel marker",
    helperText: "Use for place-based guides, memoirs, and trip planning shelves.",
  },
];

export const adminCategoryRecords: ReadonlyArray<AdminCategoryRecord> =
  adminSharedCategories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    iconKey: category.iconKey,
    markerTone: category.markerTone,
    bookCount: getAdminSharedBookCountByCategory(category.id),
  }));

export function getAdminCategoryDefaultValues(
  record?: AdminCategoryRecord,
): AdminCategoryFormValues {
  return {
    name: record?.name ?? "",
    description: record?.description ?? "",
    iconKey: record?.iconKey ?? "fiction",
  };
}

export function getAdminCategoryMarkerTone(
  iconKey: AdminCategoryIconKey,
): AdminCategoryMarkerTone {
  return iconToneMap[iconKey];
}

export function createAdminCategoryId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}