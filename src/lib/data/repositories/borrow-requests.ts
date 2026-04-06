import { adminSharedBorrowings } from "@/modules/admin-shared/mock-data";

import type { AdminSharedBorrowingRecord } from "@/modules/admin-shared/types";

export type BorrowRequestRepositoryRecord = AdminSharedBorrowingRecord;

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