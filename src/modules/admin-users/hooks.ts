"use client";

import { useDeferredValue, useState } from "react";

import {
  adminUsersFilters,
  adminUsersMetrics,
  adminUsersRecords,
} from "./data";
import type { AdminUsersFilter } from "./types";

export function useAdminUsersModuleState() {
  const [activeFilter, setActiveFilter] = useState<AdminUsersFilter>("all");
  const [searchValue, setSearchValue] = useState("");

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const records = adminUsersRecords.filter((record) => {
    const matchesFilter =
      activeFilter === "all" || record.filter === activeFilter;
    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      record.name.toLowerCase().includes(normalizedSearchValue) ||
      record.email.toLowerCase().includes(normalizedSearchValue) ||
      record.branch.toLowerCase().includes(normalizedSearchValue);

    return matchesFilter && matchesSearch;
  });

  return {
    activeFilter,
    filters: adminUsersFilters,
    metrics: adminUsersMetrics,
    records,
    searchValue,
    setActiveFilter,
    setSearchValue,
  };
}
