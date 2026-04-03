import { z } from "zod";

export type AdminCategoryFormMode = "create" | "edit";

export interface AdminCategoryRecord {
  bookCount: number;
  description: string;
  id: string;
  name: string;
}

export const adminCategoryFormSchema = z.object({
  description: z
    .string()
    .trim()
    .max(180, "Description must stay within 180 characters."),
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
