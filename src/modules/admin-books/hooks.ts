"use client";

import { useDeferredValue, useState } from "react";

import {
  adminBooksCatalog,
  adminBooksCategories,
} from "./mock-data";
import type {
  AdminBooksCategory,
  AdminBooksModuleProps,
} from "./types";

export function useAdminBooksModuleState(
  records: AdminBooksModuleProps["records"] = adminBooksCatalog,
) {
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState<AdminBooksCategory>("All");

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const sourceRecords = records ?? adminBooksCatalog;
  const filteredBooks = sourceRecords.filter((book) => {
    const matchesCategory = category === "All" || book.category === category;
    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      book.title.toLowerCase().includes(normalizedSearchValue) ||
      book.author.toLowerCase().includes(normalizedSearchValue) ||
      book.shelfCode.toLowerCase().includes(normalizedSearchValue);

    return matchesCategory && matchesSearch;
  });

  return {
    allRecordsCount: sourceRecords.length,
    books: filteredBooks,
    categories: adminBooksCategories,
    searchValue,
    setSearchValue,
    category,
    setCategory,
    clearFilters() {
      setSearchValue("");
      setCategory("All");
    },
    hasActiveFilters: searchValue.length > 0 || category !== "All",
  };
}
