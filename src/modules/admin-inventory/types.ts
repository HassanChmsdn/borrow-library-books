import { z } from "zod";

export const adminInventoryStatusValues = [
  "available",
  "borrowed",
  "maintenance",
] as const;

export const adminInventoryConditionValues = [
  "new",
  "good",
  "fair",
  "poor",
] as const;

export const adminInventoryFormModeValues = ["create", "edit"] as const;

export type AdminInventoryStatus = (typeof adminInventoryStatusValues)[number];
export type AdminInventoryCondition =
  (typeof adminInventoryConditionValues)[number];
export type AdminInventoryFormMode =
  (typeof adminInventoryFormModeValues)[number];
export type AdminInventoryStatusFilter = "all" | AdminInventoryStatus;

export interface AdminInventoryRecord {
  id: string;
  bookAuthor: string;
  bookId: string;
  bookTitle: string;
  condition: AdminInventoryCondition;
  copyCode: string;
  status: AdminInventoryStatus;
  updatedAtLabel: string;
}

export const adminInventoryFormSchema = z.object({
  bookId: z.string().trim().min(1, "Select an existing book title."),
  condition: z.enum(adminInventoryConditionValues),
  copyCode: z
    .string()
    .trim()
    .min(3, "Copy code must be at least 3 characters."),
  status: z.enum(adminInventoryStatusValues),
});

export type AdminInventoryFormValues = z.infer<typeof adminInventoryFormSchema>;
export type AdminInventoryFormFieldErrors = Partial<Record<string, string>>;

export interface AdminInventorySaveContext {
  mode: AdminInventoryFormMode;
  record?: AdminInventoryRecord;
}

export interface AdminInventoryActionHandlers {
  onSaveCopy?: (
    values: AdminInventoryFormValues,
    context: AdminInventorySaveContext,
  ) => void;
}

export interface AdminInventoryModuleProps extends AdminInventoryActionHandlers {
  isLoading?: boolean;
  records?: ReadonlyArray<AdminInventoryRecord>;
}
