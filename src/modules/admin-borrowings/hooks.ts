"use client";

import { useDeferredValue, useState } from "react";

import {
  adminBorrowingsRecords,
  adminBorrowingsTabLabels,
} from "./mock-data";
import type {
  AdminBorrowingsModuleProps,
  AdminBorrowingsTab,
} from "./types";

export function useAdminBorrowingsModuleState() {
  return useAdminBorrowingsState(adminBorrowingsRecords);
}

export function useAdminBorrowingsState(
  records: AdminBorrowingsModuleProps["records"] = adminBorrowingsRecords,
) {
  const [activeTab, setActiveTab] = useState<AdminBorrowingsTab>("pending");
  const [searchValue, setSearchValue] = useState("");

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const sourceRecords = records ?? adminBorrowingsRecords;
  const recordsInActiveTab = sourceRecords.filter(
    (record) => record.tab === activeTab,
  );

  const visibleRecords = recordsInActiveTab.filter((record) => {
    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      record.bookTitle.toLowerCase().includes(normalizedSearchValue) ||
      record.bookAuthor.toLowerCase().includes(normalizedSearchValue) ||
      record.memberName.toLowerCase().includes(normalizedSearchValue) ||
      record.memberEmail.toLowerCase().includes(normalizedSearchValue) ||
      record.branch.toLowerCase().includes(normalizedSearchValue);

    return matchesSearch;
  });

  const tabs = (
    ["pending", "active", "overdue", "returned"] as const
  ).map((value) => ({
    count: sourceRecords.filter((record) => record.tab === value).length,
    label: adminBorrowingsTabLabels[value],
    value,
  }));

  return {
    activeTab,
    clearSearch() {
      setSearchValue("");
    },
    hasSearchValue: normalizedSearchValue.length > 0,
    records: visibleRecords,
    recordsInActiveTabCount: recordsInActiveTab.length,
    searchValue,
    setActiveTab,
    setSearchValue,
    tabs,
  };
}
