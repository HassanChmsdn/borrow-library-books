import { z } from "zod";

export const adminCategoryIconKeyValues = [
  "fiction",
  "science",
  "history",
  "philosophy",
  "technology",
  "art-design",
  "business",
  "travel",
] as const;

export const adminCategoryMarkerToneValues = [
  "brand",
  "info",
  "success",
  "warning",
  "danger",
  "neutral",
] as const;

export type AdminCategoryIconKey = (typeof adminCategoryIconKeyValues)[number];
export type AdminCategoryMarkerTone =
  (typeof adminCategoryMarkerToneValues)[number];
export type AdminCategoryFormMode = "create" | "edit";

export interface AdminCategoryRecord {
  id: string;
  bookCount: number;
  description: string;
  iconKey: AdminCategoryIconKey;
  markerTone: AdminCategoryMarkerTone;
  name: string;
}

export interface AdminCategoryIconOption {
  helperText: string;
  label: string;
  value: AdminCategoryIconKey;
}

export const adminCategoryFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters.")
    .max(180, "Description must stay within 180 characters."),
  iconKey: z.enum(adminCategoryIconKeyValues),
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters.")
    .max(40, "Category name must stay within 40 characters."),
});

export type AdminCategoryFormValues = z.infer<typeof adminCategoryFormSchema>;
export type AdminCategoryFormFieldErrors = Partial<
  Record<keyof AdminCategoryFormValues, string>
>;

export interface AdminCategoryDialogState {
  mode: AdminCategoryFormMode;
  record?: AdminCategoryRecord;
}

export interface AdminCategoriesModuleProps {
  initialRecords?: ReadonlyArray<AdminCategoryRecord>;
  isLoading?: boolean;
  onCreateCategory?: (values: AdminCategoryFormValues) => void;
  onDeleteCategory?: (category: AdminCategoryRecord) => void;
  onUpdateCategory?: (
    category: AdminCategoryRecord,
    values: AdminCategoryFormValues,
  ) => void;
  searchQuery?: string;
}
