"use client";

import { useDeferredValue, useState } from "react";

import { adminUserRecords, adminUsersRoleOptions } from "./mock-data";
import type {
  AdminUserRecord,
  AdminUsersRoleFilter,
} from "./types";

export function useAdminUsersModuleState(
  inputRecords: ReadonlyArray<AdminUserRecord> = adminUserRecords,
) {
  const [roleFilter, setRoleFilter] = useState<AdminUsersRoleFilter>("all");
  const [searchValue, setSearchValue] = useState("");

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const filteredRecords = inputRecords.filter((record) => {
    const matchesFilter = roleFilter === "all" || record.role === roleFilter;
    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      record.fullName.toLowerCase().includes(normalizedSearchValue) ||
      record.email.toLowerCase().includes(normalizedSearchValue) ||
      record.borrowingSummaryLabel.toLowerCase().includes(normalizedSearchValue);

    return matchesFilter && matchesSearch;
  });

  function clearFilters() {
    setRoleFilter("all");
    setSearchValue("");
  }

  return {
    clearFilters,
    filteredRecords,
    hasActiveFilters: roleFilter !== "all" || searchValue.trim().length > 0,
    recordsCount: inputRecords.length,
    roleFilter,
    roleOptions: adminUsersRoleOptions,
    searchValue,
    setRoleFilter,
    setSearchValue,
  };
}
