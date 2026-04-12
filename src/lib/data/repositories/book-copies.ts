import { adminSharedInventoryCopies } from "@/modules/admin-shared/mock-data";

import type { AdminSharedInventoryCondition } from "@/modules/admin-shared/types";

export interface BookCopyRepositoryRecord {
  bookId: string;
  branch: string;
  condition: AdminSharedInventoryCondition;
  copyCode: string;
  id: string;
  locationNote?: string;
  shelfLabel: string;
  status: "available" | "reserved" | "borrowed" | "maintenance";
  updatedOn: string;
}

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