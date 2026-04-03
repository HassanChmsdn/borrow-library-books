import {
  adminSharedInventoryCopies,
  formatAdminRelativeAuditLabel,
  getAdminSharedBook,
} from "@/modules/admin-shared/mock-data";

import type {
  AdminInventoryCondition,
  AdminInventoryFormValues,
  AdminInventoryRecord,
  AdminInventoryStatus,
  AdminInventoryStatusFilter,
} from "./types";

import type { AdminStatusBadgeTone } from "@/components/admin";

export const adminInventoryStatusLabels: Record<AdminInventoryStatus, string> = {
  available: "Available",
  borrowed: "Borrowed",
  maintenance: "Maintenance",
};

export const adminInventoryConditionLabels: Record<
  AdminInventoryCondition,
  string
> = {
  new: "New",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

export const adminInventoryStatusTones: Record<
  AdminInventoryStatus,
  AdminStatusBadgeTone
> = {
  available: "success",
  borrowed: "info",
  maintenance: "danger",
};

export const adminInventoryConditionTones: Record<
  AdminInventoryCondition,
  AdminStatusBadgeTone
> = {
  new: "success",
  good: "neutral",
  fair: "warning",
  poor: "danger",
};

export const adminInventoryStatusOptions: ReadonlyArray<{
  label: string;
  value: AdminInventoryStatusFilter;
}> = [
  { label: "All states", value: "all" },
  { label: "Available", value: "available" },
  { label: "Borrowed", value: "borrowed" },
  { label: "Maintenance", value: "maintenance" },
];

export const adminInventoryRecords: ReadonlyArray<AdminInventoryRecord> =
  adminSharedInventoryCopies.map((copy) => {
    const book = getAdminSharedBook(copy.bookId);

    return {
      id: copy.id,
      bookId: copy.bookId,
      bookTitle: book?.title ?? "Unknown book",
      bookAuthor: book?.author ?? "Unknown author",
      copyCode: copy.copyCode,
      location: `${copy.branch} · ${copy.shelfLabel}`,
      locationNote: copy.locationNote,
      condition: copy.condition,
      status: copy.status,
      updatedAtLabel: formatAdminRelativeAuditLabel(copy.updatedOn),
    };
  });

export function createAdminInventoryFormValues(
  record?: AdminInventoryRecord,
): AdminInventoryFormValues {
  return {
    bookAuthor: record?.bookAuthor ?? "",
    bookId: record?.bookId ?? "",
    bookTitle: record?.bookTitle ?? "",
    condition: record?.condition ?? "good",
    copyCode: record?.copyCode ?? "",
    location: record?.location ?? "",
    locationNote: record?.locationNote ?? "",
    status: record?.status ?? "available",
  };
}