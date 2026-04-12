import "server-only";

import { cache } from "react";

import {
  listBookCopyRecordsForBookFromStore,
  listBookRecordsFromStore,
  listCategoryRecordsFromStore,
} from "@/lib/data/server";

import type { AllBooksItem } from "./all-books-data";

const legacyBookIdAliases: Record<string, string> = {
  "brief-history-of-time": "brief-history-time",
  "design-of-everyday-things": "design-everyday-things",
  "thinking-fast-and-slow": "thinking-fast-slow",
};

function resolveBookId(bookId: string) {
  return legacyBookIdAliases[bookId] ?? bookId;
}

export const listCatalogBooks = cache(async (): Promise<ReadonlyArray<AllBooksItem>> => {
  const [books, categories] = await Promise.all([
    listBookRecordsFromStore(),
    listCategoryRecordsFromStore(),
  ]);
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  const items = await Promise.all(
    books
      .filter((book) => book.recordStatus === "active")
      .map(async (book) => {
        const copies = await listBookCopyRecordsForBookFromStore(book.id);
        const availableCopies = copies.filter((copy) => copy.status === "available").length;

        return {
          author: book.author,
          availableCopies,
          category: categoryNameById.get(book.categoryId) ?? "Uncategorized",
          coverLabel: book.coverLabel,
          coverTone: book.coverTone,
          description: book.description,
          feeCents: book.feeCents,
          id: book.id,
          title: book.title,
          totalCopies: copies.length,
        } satisfies AllBooksItem;
      }),
  );

  return items.sort((left, right) => left.title.localeCompare(right.title));
});

export async function getCatalogBookById(bookId: string) {
  const resolvedBookId = resolveBookId(bookId);
  const books = await listCatalogBooks();

  return books.find((book) => book.id === resolvedBookId) ?? null;
}

export async function getCatalogBookDetailsById(bookId: string) {
  const resolvedBookId = resolveBookId(bookId);
  const [book, books] = await Promise.all([
    getCatalogBookById(resolvedBookId),
    listBookRecordsFromStore(),
  ]);

  const bookRecord = books.find((record) => record.id === resolvedBookId) ?? null;

  if (!book || !bookRecord) {
    return null;
  }

  return {
    allowCustomDuration: bookRecord.allowCustomDuration,
    book,
  };
}