import { adminSharedBorrowings } from "@/modules/admin-shared/mock-data";

import type {
  AdminSharedBorrowingStatus,
  AdminSharedPaymentStatus,
} from "@/modules/admin-shared/types";

export interface BorrowRequestRepositoryRecord {
  bookId: string;
  branch: string;
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

const borrowRequestRecords: ReadonlyArray<BorrowRequestRepositoryRecord> =
  adminSharedBorrowings;

export function listBorrowRequestRecords() {
  return borrowRequestRecords;
}

export function getBorrowRequestRecordById(requestId: string) {
  return borrowRequestRecords.find((record) => record.id === requestId) ?? null;
}

export function listBorrowRequestRecordsForBook(bookId: string) {
  return borrowRequestRecords.filter((record) => record.bookId === bookId);
}

export function listBorrowRequestRecordsForUser(userId: string) {
  return borrowRequestRecords.filter((record) => record.userId === userId);
}