import { adminSharedBooks } from "@/modules/admin-shared/mock-data";

import type { AdminSharedBookRecord } from "@/modules/admin-shared/types";

import { listBookCopyRecordsForBook } from "./book-copies";

export type BookRepositoryRecord = AdminSharedBookRecord;

export interface BookInventorySnapshot {
  availableCopies: number;
  borrowedCopies: number;
  lastUpdatedOn: string | null;
  reservedCopies: number;
  shelfCode: string;
  totalCopies: number;
}

const bookRecords: ReadonlyArray<BookRepositoryRecord> = adminSharedBooks;

export function listBookRecords() {
  return bookRecords;
}

export function getBookRecordById(bookId: string) {
  return bookRecords.find((book) => book.id === bookId) ?? null;
}

export function listBookRecordsByCategory(categoryId: string) {
  return bookRecords.filter((book) => book.categoryId === categoryId);
}

export function countBookRecordsByCategory(categoryId: string) {
  return listBookRecordsByCategory(categoryId).length;
}

export function getBookInventorySnapshot(bookId: string): BookInventorySnapshot {
  const copies = listBookCopyRecordsForBook(bookId);
  const book = getBookRecordById(bookId);
  const updatedTimestamps = copies
    .map((copy) => copy.updatedOn)
    .sort((left, right) => right.localeCompare(left));
  const availableCopies = copies.filter((copy) => copy.status === "available").length;
  const borrowedCopies = copies.filter((copy) => copy.status === "borrowed").length;
  const reservedCopies = Math.max(copies.length - availableCopies - borrowedCopies, 0);

  return {
    availableCopies,
    borrowedCopies,
    lastUpdatedOn: updatedTimestamps[0] ?? null,
    reservedCopies,
    shelfCode: book?.shelfCode ?? "Unassigned",
    totalCopies: copies.length,
  };
}