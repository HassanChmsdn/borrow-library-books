import { z } from "zod";

import type { BookCoverTone } from "@/modules/catalog/all-books-data";

import type {
  AvailabilityBadgeTone,
  BorrowStatusBadgeTone,
} from "@/components/library";

export type AdminBooksCategory = string;

export const adminBookCategoryValues = [
  "Fiction",
  "Science",
  "History",
  "Philosophy",
  "Technology",
  "Art & Design",
  "Business",
  "Travel",
] as const;

export type AdminBookCategory = (typeof adminBookCategoryValues)[number];

export type AdminBooksStatusFilter = "all" | "healthy" | "limited" | "archived";

export type AdminBooksSortValue =
  | "updated"
  | "title"
  | "author"
  | "availability"
  | "fee";

export const adminBookFormModeValues = ["create", "edit"] as const;
export const adminBookFeeModeValues = ["free", "cash"] as const;
export const adminBookFormStatusValues = ["active", "inactive"] as const;
export const adminBookDurationPresetValues = [7, 14, 21, 28] as const;

const adminBookDurationPresetSchema = z.union([
  z.literal(7),
  z.literal(14),
  z.literal(21),
  z.literal(28),
]);

export type AdminBookFormMode = (typeof adminBookFormModeValues)[number];
export type AdminBookFeeMode = (typeof adminBookFeeModeValues)[number];
export type AdminBookFormStatus = (typeof adminBookFormStatusValues)[number];
export type AdminBookDurationPreset =
  (typeof adminBookDurationPresetValues)[number];

export interface AdminBookRecord {
  id: string;
  title: string;
  author: string;
  category: string;
  shelfCode: string;
  totalCopies: number;
  availableCopies: number;
  feeCents: number;
  coverTone: BookCoverTone;
  coverLabel: string;
  availabilityTone: AvailabilityBadgeTone;
  statusLabel: string;
  statusTone: BorrowStatusBadgeTone;
}

export interface AdminBookDurationOption {
  days: AdminBookDurationPreset;
  helperText: string;
  label: string;
}

export interface AdminBookInventorySummary {
  availableCopies: number;
  borrowedCopies: number;
  lastAuditLabel: string;
  reservedCopies: number;
  shelfCode: string;
  totalCopies: number;
}

export interface AdminBookPublicationMetadata {
  edition: string;
  language: string;
  publishedYear: string;
  publisher: string;
}

export interface AdminBookDetailsRecord extends AdminBookRecord {
  allowCustomDuration: boolean;
  coverImageFileName: string;
  description: string;
  inventorySummary?: AdminBookInventorySummary;
  isbn: string;
  metadata: AdminBookPublicationMetadata;
  predefinedDurations: ReadonlyArray<AdminBookDurationPreset>;
  recordStatus: AdminBookFormStatus;
}

export const adminBookFormSchema = z
  .object({
    basicInfo: z.object({
      author: z
        .string()
        .trim()
        .min(2, "Author name must be at least 2 characters."),
      category: z.enum(adminBookCategoryValues),
      description: z
        .string()
        .trim()
        .min(40, "Description must be at least 40 characters."),
      isbn: z
        .string()
        .trim()
        .min(10, "ISBN should be at least 10 characters.")
        .regex(
          /^(?:97[89][- ]?)?[0-9][- 0-9]{8,16}[0-9X]$/i,
          "Use a valid ISBN-10 or ISBN-13 format.",
        ),
      title: z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters."),
    }),
    cover: z.object({
      fileName: z
        .string()
        .trim()
        .max(140, "File name is too long.")
        .optional(),
    }),
    durationSettings: z.object({
      allowCustomDuration: z.boolean(),
      presetDays: z
        .array(adminBookDurationPresetSchema)
        .min(1, "Choose at least one predefined duration."),
    }),
    feeSettings: z.object({
      amount: z
        .string()
        .trim()
        .regex(/^(?:|\d+(?:\.\d{1,2})?)$/, "Use a valid cash amount."),
      mode: z.enum(adminBookFeeModeValues),
    }),
    metadata: z.object({
      edition: z.string().trim().max(40, "Edition is too long."),
      language: z.string().trim().max(40, "Language is too long."),
      publishedYear: z
        .string()
        .trim()
        .regex(/^(|\d{4})$/, "Use a four-digit publication year."),
      publisher: z.string().trim().max(80, "Publisher is too long."),
    }),
    status: z.enum(adminBookFormStatusValues),
  })
  .superRefine((values, context) => {
    if (values.feeSettings.mode === "free") {
      return;
    }

    if (values.feeSettings.amount.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a cash fee amount or switch the book to Free.",
        path: ["feeSettings", "amount"],
      });
      return;
    }

    const parsedAmount = Number(values.feeSettings.amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cash fee must be greater than zero.",
        path: ["feeSettings", "amount"],
      });
    }
  });

export type AdminBookFormValues = z.infer<typeof adminBookFormSchema>;
export type AdminBookFormFieldErrors = Partial<Record<string, string>>;

export interface AdminBooksModuleProps {
  isLoading?: boolean;
  onAddBook?: () => void;
  onDeleteBook?: (book: AdminBookRecord) => void;
  onEditBook?: (book: AdminBookRecord) => void;
  records?: ReadonlyArray<AdminBookRecord>;
}

export interface AdminBookDetailsModuleProps {
  book?: AdminBookDetailsRecord;
  isLoading?: boolean;
  mode: AdminBookFormMode;
  onDeleteBook?: (book: AdminBookDetailsRecord) => void;
  onSaveBook?: (values: AdminBookFormValues) => void;
}
