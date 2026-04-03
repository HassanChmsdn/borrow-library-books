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

export const adminInventoryRecords: ReadonlyArray<AdminInventoryRecord> = [
  {
    id: "copy-1984-01",
    bookId: "1984",
    bookTitle: "1984",
    bookAuthor: "George Orwell",
    copyCode: "DT-FIC-1984-01",
    location: "Downtown · Shelf F3",
    locationNote: "Front fiction bay",
    condition: "good",
    status: "available",
    updatedAtLabel: "Audited 2 hours ago",
  },
  {
    id: "copy-1984-02",
    bookId: "1984",
    bookTitle: "1984",
    bookAuthor: "George Orwell",
    copyCode: "DT-FIC-1984-02",
    location: "Downtown · Shelf F3",
    locationNote: "Assigned to active loan",
    condition: "fair",
    status: "borrowed",
    updatedAtLabel: "Checked out today",
  },
  {
    id: "copy-clean-code-01",
    bookId: "clean-code",
    bookTitle: "Clean Code",
    bookAuthor: "Robert C. Martin",
    copyCode: "DT-TEC-CLN-01",
    location: "Technology Floor · Rack T2",
    locationNote: "Near software reference set",
    condition: "good",
    status: "available",
    updatedAtLabel: "Audited yesterday",
  },
  {
    id: "copy-brief-time-01",
    bookId: "brief-history-time",
    bookTitle: "A Brief History of Time",
    bookAuthor: "Stephen Hawking",
    copyCode: "HM-SCI-BHT-01",
    location: "Hamra · Science Annex S1",
    locationNote: "Queued for return review",
    condition: "new",
    status: "borrowed",
    updatedAtLabel: "Due back tomorrow",
  },
  {
    id: "copy-sapiens-03",
    bookId: "sapiens",
    bookTitle: "Sapiens",
    bookAuthor: "Yuval Noah Harari",
    copyCode: "HM-HIS-SAP-03",
    location: "Hamra · History Shelf H4",
    locationNote: "Binding check requested",
    condition: "poor",
    status: "maintenance",
    updatedAtLabel: "Inspection logged today",
  },
  {
    id: "copy-into-wild-02",
    bookId: "into-the-wild",
    bookTitle: "Into the Wild",
    bookAuthor: "Jon Krakauer",
    copyCode: "BY-TRV-WLD-02",
    location: "Byblos · Travel Shelf T1",
    locationNote: "Window display copy",
    condition: "good",
    status: "available",
    updatedAtLabel: "Moved this morning",
  },
];

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