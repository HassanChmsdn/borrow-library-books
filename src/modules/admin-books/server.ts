import "server-only";

import { cache } from "react";

import {
  getBookInventorySnapshotFromStore,
  listBookRecordsFromStore,
  listCategoryRecordsFromStore,
} from "@/lib/data/server";
import { formatAdminRelativeAuditLabel } from "@/modules/admin-shared/mock-data";

import type { AdminBookDetailsRecord, AdminBookRecord } from "./types";

function normalizeAdminBookCategory(categoryName: string) {
  if (categoryName === "Design") {
    return "Art & Design";
  }

  if (categoryName === "Literature") {
    return "Fiction";
  }

  return categoryName;
}

function deriveAvailabilityState(availableCopies: number, totalCopies: number) {
  if (availableCopies === 0) {
    return {
      availabilityTone: "unavailable" as const,
      statusLabel: "Out of stock",
      statusTone: "danger" as const,
    };
  }

  if (availableCopies / Math.max(totalCopies, 1) <= 0.34) {
    return {
      availabilityTone: "limited" as const,
      statusLabel: "Low stock",
      statusTone: "warning" as const,
    };
  }

  return {
    availabilityTone: "available" as const,
    statusLabel: "Available",
    statusTone: "success" as const,
  };
}

export const listAdminBookDetailRecords = cache(
  async (): Promise<ReadonlyArray<AdminBookDetailsRecord>> => {
    const [books, categories] = await Promise.all([
      listBookRecordsFromStore(),
      listCategoryRecordsFromStore(),
    ]);
    const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

    const records = await Promise.all(
      books.map(async (book) => {
        const inventorySnapshot = await getBookInventorySnapshotFromStore(book.id);
        const totalCopies = Math.max(inventorySnapshot.totalCopies, 1);

        return {
          allowCustomDuration: book.allowCustomDuration,
          author: book.author,
          availableCopies: inventorySnapshot.availableCopies,
          category: normalizeAdminBookCategory(
            categoryNameById.get(book.categoryId) ?? "Uncategorized",
          ),
          coverImageFileName: book.coverImageFileName,
          coverLabel: book.coverLabel,
          coverTone: book.coverTone,
          description: book.description,
          feeCents: book.feeCents,
          id: book.id,
          inventorySummary: {
            availableCopies: inventorySnapshot.availableCopies,
            borrowedCopies: inventorySnapshot.borrowedCopies,
            lastAuditLabel: inventorySnapshot.lastUpdatedOn
              ? formatAdminRelativeAuditLabel(inventorySnapshot.lastUpdatedOn)
              : "No copies tracked yet",
            reservedCopies: inventorySnapshot.reservedCopies,
            shelfCode: inventorySnapshot.shelfCode,
            totalCopies: inventorySnapshot.totalCopies,
          },
          isbn: book.isbn,
          metadata: {
            edition: book.metadata.edition,
            language: book.metadata.language,
            publishedYear: book.metadata.publishedYear,
            publisher: book.metadata.publisher,
          },
          predefinedDurations: [...book.predefinedDurations],
          recordStatus: book.recordStatus,
          shelfCode: book.shelfCode,
          title: book.title,
          totalCopies: inventorySnapshot.totalCopies,
          ...deriveAvailabilityState(inventorySnapshot.availableCopies, totalCopies),
        } satisfies AdminBookDetailsRecord;
      }),
    );

    return records.sort((left, right) => left.title.localeCompare(right.title));
  },
);

export async function listAdminBookRecords(): Promise<ReadonlyArray<AdminBookRecord>> {
  const records = await listAdminBookDetailRecords();

  return records.map((record) => ({
    author: record.author,
    availabilityTone: record.availabilityTone,
    availableCopies: record.availableCopies,
    category: record.category,
    coverLabel: record.coverLabel,
    coverTone: record.coverTone,
    feeCents: record.feeCents,
    id: record.id,
    shelfCode: record.shelfCode,
    statusLabel: record.statusLabel,
    statusTone: record.statusTone,
    title: record.title,
    totalCopies: record.totalCopies,
  }));
}

export async function getAdminBookDetailsRecordByIdFromStore(bookId: string) {
  const records = await listAdminBookDetailRecords();

  return records.find((record) => record.id === bookId) ?? null;
}