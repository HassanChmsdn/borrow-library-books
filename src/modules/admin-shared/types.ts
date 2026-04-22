export type AdminSharedMarkerTone =
  | "brand"
  | "danger"
  | "info"
  | "neutral"
  | "success"
  | "warning";

export type AdminSharedStatusTone = Exclude<AdminSharedMarkerTone, "brand">;

export type AdminSharedCategoryId =
  | "fiction"
  | "science"
  | "history"
  | "philosophy"
  | "technology"
  | "art-design"
  | "business"
  | "travel";

export type AdminSharedCoverTone =
  | "amber"
  | "brand"
  | "forest"
  | "ocean"
  | "rose"
  | "stone";

export type AdminSharedDurationPreset = 7 | 14 | 21 | 28;

export type AdminSharedUserRole = "admin" | "user";

export type AdminSharedUserStatus = "active" | "suspended";

export type AdminSharedInventoryStatus =
  | "available"
  | "borrowed"
  | "maintenance";

export type AdminSharedInventoryCondition = "new" | "good" | "fair" | "poor";

export type AdminSharedBorrowingStatus =
  | "active"
  | "cancelled"
  | "overdue"
  | "pending"
  | "returned";

export type AdminSharedPaymentStatus =
  | "cash-due"
  | "cash-settled"
  | "not-required";

export interface AdminSharedCategoryRecord {
  description: string;
  iconKey: AdminSharedCategoryId;
  id: AdminSharedCategoryId;
  markerTone: AdminSharedMarkerTone;
  name: string;
}

export interface AdminSharedBookRecord {
  allowCustomDuration: boolean;
  author: string;
  categoryId: AdminSharedCategoryId;
  coverImageFileName: string;
  coverLabel: string;
  coverTone: AdminSharedCoverTone;
  description: string;
  feeCents: number;
  id: string;
  isbn: string;
  metadata: {
    edition: string;
    language: string;
    publishedYear: string;
    publisher: string;
  };
  predefinedDurations: ReadonlyArray<AdminSharedDurationPreset>;
  recordStatus: "active" | "inactive";
  shelfCode: string;
  title: string;
}

export interface AdminSharedInventoryCopyRecord {
  bookId: string;
  branch: string;
  condition: AdminSharedInventoryCondition;
  copyCode: string;
  id: string;
  locationNote?: string;
  shelfLabel: string;
  status: AdminSharedInventoryStatus;
  updatedOn: string;
}

export interface AdminSharedUserRecord {
  email: string;
  fullName: string;
  id: string;
  joinedOn: string;
  membershipLabel: string;
  profileNote: string;
  role: AdminSharedUserRole;
  status: AdminSharedUserStatus;
}

export interface AdminSharedBorrowingRecord {
  bookId: string;
  branch: string;
  cancelledOn?: string;
  customDuration: boolean;
  durationDays: number;
  feeCents: number;
  id: string;
  note?: string;
  paymentStatus: AdminSharedPaymentStatus;
  requestedOn: string;
  returnedOn?: string;
  startedOn?: string;
  status: AdminSharedBorrowingStatus;
  userId: string;
}

export interface AdminSharedActivityRecord {
  actorRoleLabel: string;
  actorUserId: string;
  description: string;
  id: string;
  occurredOn: string;
  statusLabel: string;
  statusTone: AdminSharedStatusTone;
  title: string;
}