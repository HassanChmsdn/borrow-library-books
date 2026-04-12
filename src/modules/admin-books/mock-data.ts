import type { BookCoverTone } from "@/modules/catalog/all-books-data";
import {
  getBookInventorySnapshot,
  listBookRecords,
  listCategoryRecords,
} from "@/lib/data";
import { formatAdminRelativeAuditLabel } from "@/modules/admin-shared/mock-data";

import type {
  AdminBookCategory,
  AdminBookDetailsRecord,
  AdminBookDurationOption,
  AdminBookFormValues,
  AdminBookRecord,
  AdminBooksCategory,
  AdminBooksStatusFilter,
} from "./types";

function deriveAvailabilityState(
  availableCopies: number,
  totalCopies: number,
): Pick<AdminBookRecord, "availabilityTone" | "statusLabel" | "statusTone"> {
  if (availableCopies === 0) {
    return {
      availabilityTone: "unavailable",
      statusLabel: "Out of stock",
      statusTone: "danger",
    };
  }

  if (availableCopies / totalCopies <= 0.34) {
    return {
      availabilityTone: "limited",
      statusLabel: "Low stock",
      statusTone: "warning",
    };
  }

  return {
    availabilityTone: "available",
    statusLabel: "Available",
    statusTone: "success",
  };
}

function toAdminBookCategory(categoryName: string) {
  return categoryName as AdminBookCategory;
}

export const adminBooksCategories: ReadonlyArray<AdminBooksCategory> = [
  "All",
  ...listCategoryRecords().map((category) => category.name as AdminBookCategory),
];

export const adminBooksStatusOptions: ReadonlyArray<{
  label: string;
  value: AdminBooksStatusFilter;
}> = [
  { label: "All states", value: "all" },
  { label: "Available", value: "healthy" },
  { label: "Low stock", value: "limited" },
  { label: "Out of stock", value: "archived" },
];

export const adminBookDurationOptions: ReadonlyArray<AdminBookDurationOption> = [
  { days: 7, label: "7 days", helperText: "Short pickup cycle" },
  { days: 14, label: "14 days", helperText: "Standard circulation" },
  { days: 21, label: "21 days", helperText: "Extended loan" },
  { days: 28, label: "28 days", helperText: "Research hold" },
];

export const adminBookDetailRecords: ReadonlyArray<AdminBookDetailsRecord> =
  listBookRecords().map((book) => {
    const inventorySnapshot = getBookInventorySnapshot(book.id);
    const categoryName =
      listCategoryRecords().find((category) => category.id === book.categoryId)?.name ??
      "Fiction";

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      category: toAdminBookCategory(categoryName),
      shelfCode: book.shelfCode,
      totalCopies: inventorySnapshot.totalCopies,
      availableCopies: inventorySnapshot.availableCopies,
      feeCents: book.feeCents,
      coverTone: book.coverTone as BookCoverTone,
      coverLabel: book.coverLabel,
      coverImageFileName: book.coverImageFileName,
      isbn: book.isbn,
      description: book.description,
      predefinedDurations: book.predefinedDurations,
      allowCustomDuration: book.allowCustomDuration,
      metadata: book.metadata,
      recordStatus: book.recordStatus,
      inventorySummary: {
        availableCopies: inventorySnapshot.availableCopies,
        borrowedCopies: inventorySnapshot.borrowedCopies,
        lastAuditLabel: inventorySnapshot.lastUpdatedOn
          ? formatAdminRelativeAuditLabel(inventorySnapshot.lastUpdatedOn)
          : "No copies tracked yet",
        reservedCopies: inventorySnapshot.reservedCopies,
        shelfCode: inventorySnapshot.shelfCode,
        totalCopies: inventorySnapshot.totalCopies,
      },
      ...deriveAvailabilityState(
        inventorySnapshot.availableCopies,
        Math.max(inventorySnapshot.totalCopies, 1),
      ),
    };
  });

export const adminBooksCatalog: ReadonlyArray<AdminBookRecord> =
  adminBookDetailRecords.map((record) => ({
    id: record.id,
    title: record.title,
    author: record.author,
    category: record.category,
    shelfCode: record.shelfCode,
    totalCopies: record.totalCopies,
    availableCopies: record.availableCopies,
    feeCents: record.feeCents,
    coverTone: record.coverTone,
    coverLabel: record.coverLabel,
    availabilityTone: record.availabilityTone,
    statusLabel: record.statusLabel,
    statusTone: record.statusTone,
  }));

const defaultBookMetadata = {
  edition: "",
  language: "English",
  publishedYear: "",
  publisher: "",
} as const;

const defaultDurationOptions = [7, 14, 21] as const;

const categoryCoverTones: Record<AdminBookCategory, BookCoverTone> = {
  "Art & Design": "rose",
  Business: "ocean",
  Fiction: "brand",
  History: "stone",
  Philosophy: "amber",
  Science: "ocean",
  Technology: "stone",
  Travel: "forest",
};

export const adminBookCreateDefaults: AdminBookFormValues = {
  basicInfo: {
    author: "",
    category: "Fiction",
    description: "",
    isbn: "",
    title: "",
  },
  cover: {
    fileName: "",
  },
  durationSettings: {
    allowCustomDuration: true,
    presetDays: [...defaultDurationOptions],
  },
  feeSettings: {
    amount: "",
    mode: "free",
  },
  metadata: {
    ...defaultBookMetadata,
  },
  status: "active",
};

export function createAdminBookFormValues(
  record: AdminBookDetailsRecord,
): AdminBookFormValues {
  return {
    basicInfo: {
      author: record.author,
      category: record.category as AdminBookFormValues["basicInfo"]["category"],
      description: record.description,
      isbn: record.isbn,
      title: record.title,
    },
    cover: {
      fileName: record.coverImageFileName,
    },
    durationSettings: {
      allowCustomDuration: record.allowCustomDuration,
      presetDays: [...record.predefinedDurations],
    },
    feeSettings: {
      amount: record.feeCents === 0 ? "" : (record.feeCents / 100).toFixed(2),
      mode: record.feeCents === 0 ? "free" : "cash",
    },
    metadata: {
      edition: record.metadata.edition,
      language: record.metadata.language,
      publishedYear: record.metadata.publishedYear,
      publisher: record.metadata.publisher,
    },
    status: record.recordStatus,
  };
}

export function deriveAdminBookCoverTone(category: AdminBookCategory): BookCoverTone {
  return categoryCoverTones[category];
}

export function getAdminBookDetailsRecordById(bookId: string) {
  return adminBookDetailRecords.find((record) => record.id === bookId);
}