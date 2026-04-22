import "server-only";

import {
  listBookCopyRecordsFromStore,
  listBookRecordsFromStore,
} from "@/lib/data/server";
import { formatAdminRelativeAuditLabel } from "@/modules/admin-shared/mock-data";

import type { AdminInventoryRecord } from "./types";

export interface AdminInventoryBookOption {
  description: string;
  label: string;
  value: string;
}

export async function listAdminInventoryRecords(): Promise<
  ReadonlyArray<AdminInventoryRecord>
> {
  const [copies, books] = await Promise.all([
    listBookCopyRecordsFromStore(),
    listBookRecordsFromStore(),
  ]);
  const bookById = new Map(books.map((book) => [book.id, book]));

  return copies.map((copy) => {
    const book = bookById.get(copy.bookId);

      return {
        bookAuthor: book?.author ?? "Unknown author",
        bookId: copy.bookId,
        bookTitle: book?.title ?? "Unknown book",
        condition: copy.condition,
        copyCode: copy.copyCode,
        id: copy.id,
        status: copy.status === "reserved" ? "borrowed" : copy.status,
        updatedAtLabel: formatAdminRelativeAuditLabel(copy.updatedOn),
      } satisfies AdminInventoryRecord;
  });
}

export async function listAdminInventoryBookOptions(): Promise<
  ReadonlyArray<AdminInventoryBookOption>
> {
  const books = await listBookRecordsFromStore();

  return [
    {
      description: "Choose an existing catalog record.",
      label: "Select a book",
      value: "",
    },
    ...books.map((book) => ({
      description: `${book.author} · ${book.shelfCode}`,
      label: book.title,
      value: book.id,
    })),
  ];
}