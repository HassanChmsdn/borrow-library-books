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
  location: string;
  locationNote?: string;
  status: AdminInventoryStatus;
  updatedAtLabel: string;
}

export const adminInventoryFormSchema = z.object({
  bookAuthor: z
    .string()
    .trim()
    .min(2, "Author name must be at least 2 characters."),
  bookId: z.string().trim().optional(),
  bookTitle: z
    .string()
    .trim()
    .min(2, "Book title must be at least 2 characters."),
  condition: z.enum(adminInventoryConditionValues),
  copyCode: z
    .string()
    .trim()
    .min(3, "Copy code must be at least 3 characters."),
  location: z
    .string()
    .trim()
    .min(3, "Location must be at least 3 characters."),
  locationNote: z.string().trim().max(80, "Location note is too long."),
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
