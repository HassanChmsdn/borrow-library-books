"use client";

import { useDeferredValue, useState } from "react";

import {
  adminBooksCatalog,
  adminBooksCategories,
  adminBooksMetrics,
  adminBooksSortOptions,
  adminBooksStatusOptions,
} from "./data";
import type {
  AdminBookRecord,
  AdminBooksCategory,
  AdminBooksSortValue,
  AdminBooksStatusFilter,
} from "./types";

function sortBooks(
  books: ReadonlyArray<AdminBookRecord>,
  sortValue: AdminBooksSortValue,
) {
  const nextBooks = [...books];

  if (sortValue === "title") {
    nextBooks.sort((left, right) => left.title.localeCompare(right.title));
    return nextBooks;
  }

  if (sortValue === "author") {
    nextBooks.sort((left, right) => left.author.localeCompare(right.author));
    return nextBooks;
  }

  if (sortValue === "availability") {
    nextBooks.sort(
      (left, right) => right.availableCopies - left.availableCopies,
    );
    return nextBooks;
  }

  if (sortValue === "fee") {
    nextBooks.sort((left, right) => left.feeCents - right.feeCents);
    return nextBooks;
  }

  return nextBooks;
}

export function useAdminBooksModuleState() {
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState<AdminBooksCategory>("All");
  const [status, setStatus] = useState<AdminBooksStatusFilter>("all");
  const [sortValue, setSortValue] = useState<AdminBooksSortValue>("updated");

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const filteredBooks = sortBooks(
    adminBooksCatalog.filter((book) => {
      const matchesCategory = category === "All" || book.category === category;
      const matchesStatus = status === "all" || book.statusFilter === status;
      const matchesSearch =
        normalizedSearchValue.length === 0 ||
        book.title.toLowerCase().includes(normalizedSearchValue) ||
        book.author.toLowerCase().includes(normalizedSearchValue) ||
        book.shelfCode.toLowerCase().includes(normalizedSearchValue);

      return matchesCategory && matchesStatus && matchesSearch;
    }),
    sortValue,
  );

  return {
    books: filteredBooks,
    categories: adminBooksCategories,
    metrics: adminBooksMetrics,
    searchValue,
    setSearchValue,
    category,
    setCategory,
    status,
    setStatus,
    statusOptions: adminBooksStatusOptions,
    sortValue,
    setSortValue,
    sortOptions: adminBooksSortOptions,
  };
}
