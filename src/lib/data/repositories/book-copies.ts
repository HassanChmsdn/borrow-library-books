import { adminSharedInventoryCopies } from "@/modules/admin-shared/mock-data";

import type { AdminSharedInventoryCopyRecord } from "@/modules/admin-shared/types";

export type BookCopyRepositoryRecord = AdminSharedInventoryCopyRecord;

const bookCopyRecords: ReadonlyArray<BookCopyRepositoryRecord> = adminSharedInventoryCopies;

export function listBookCopyRecords() {
  return bookCopyRecords;
}

export function getBookCopyRecordById(copyId: string) {
  return bookCopyRecords.find((copy) => copy.id === copyId) ?? null;
}

export function listBookCopyRecordsForBook(bookId: string) {
  return bookCopyRecords.filter((copy) => copy.bookId === bookId);
}