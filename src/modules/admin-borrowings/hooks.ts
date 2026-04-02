"use client";

import { useDeferredValue, useState } from "react";

import {
  adminBorrowingsMetrics,
  adminBorrowingsRecords,
  adminBorrowingsTabs,
} from "./data";
import type { AdminBorrowingsTab } from "./types";

export function useAdminBorrowingsModuleState() {
  const [activeTab, setActiveTab] = useState<AdminBorrowingsTab>("active");
  const [searchValue, setSearchValue] = useState("");

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const records = adminBorrowingsRecords.filter((record) => {
    const matchesTab = record.tab === activeTab;
    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      record.bookTitle.toLowerCase().includes(normalizedSearchValue) ||
      record.memberName.toLowerCase().includes(normalizedSearchValue) ||
      record.branch.toLowerCase().includes(normalizedSearchValue);

    return matchesTab && matchesSearch;
  });

  return {
    activeTab,
    metrics: adminBorrowingsMetrics,
    records,
    searchValue,
    setActiveTab,
    setSearchValue,
    tabs: adminBorrowingsTabs,
  };
}
