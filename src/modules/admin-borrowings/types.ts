import type { BookCoverTone } from "@/modules/catalog/all-books-data";

import type { AdminStatusBadgeTone } from "@/components/admin";

export const adminBorrowingTabValues = [
  "pending",
  "active",
  "overdue",
  "returned",
] as const;

export type AdminBorrowingsTab = (typeof adminBorrowingTabValues)[number];

export interface AdminBorrowingsTabItem {
  count: number;
  label: string;
  value: AdminBorrowingsTab;
}

export interface AdminBorrowingTimeline {
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel?: string;
  secondaryValue?: string;
}

export interface AdminBorrowingRecord {
  id: string;
  bookAuthor: string;
  bookCoverLabel: string;
  bookCoverTone: BookCoverTone;
  bookId: string;
  bookTitle: string;
  borrowingStatusLabel: string;
  borrowingStatusTone: AdminStatusBadgeTone;
  branch: string;
  durationLabel: string;
  feeCents: number;
  isCustomDuration: boolean;
  memberEmail: string;
  memberMembership: string;
  memberName: string;
  paymentHelperText?: string;
  paymentStatusLabel: string;
  paymentStatusTone: AdminStatusBadgeTone;
  tab: AdminBorrowingsTab;
  timeline: AdminBorrowingTimeline;
}

export interface AdminBorrowingActionHandlers {
  onApproveBorrowing?: (record: AdminBorrowingRecord) => void;
  onMarkReturned?: (record: AdminBorrowingRecord) => void;
  onRejectBorrowing?: (record: AdminBorrowingRecord) => void;
  onSendReminder?: (record: AdminBorrowingRecord) => void;
}

export interface AdminBorrowingsModuleProps
  extends AdminBorrowingActionHandlers {
  isLoading?: boolean;
  records?: ReadonlyArray<AdminBorrowingRecord>;
}
