import "server-only";

import { cache } from "react";

import {
  countBookRecordsByCategoryFromStore,
  listCategoryRecordsFromStore,
} from "@/lib/data/server";

import type { AdminCategoryRecord } from "./types";

export const listAdminCategoryRecords = cache(
  async (): Promise<ReadonlyArray<AdminCategoryRecord>> => {
    const categories = await listCategoryRecordsFromStore();

    const records = await Promise.all(
      categories.map(async (category) => ({
        bookCount: await countBookRecordsByCategoryFromStore(category.id),
        description: category.description,
        id: category.id,
        name: category.name,
      })),
    );

    return records.sort((left, right) => left.name.localeCompare(right.name));
  },
);