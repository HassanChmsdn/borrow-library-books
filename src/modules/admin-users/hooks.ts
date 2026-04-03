"use client";

import {
  startTransition,
  useDeferredValue,
  useState,
} from "react";

import {
  adminUserRecords,
  adminUsersRoleOptions,
} from "./mock-data";
import type {
  AdminUserProfileRecord,
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

export function useAdminUserProfileState(initialUser?: AdminUserProfileRecord) {
  const [user, setUser] = useState(initialUser);
  const [isMutating, setIsMutating] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  function applyMockAction(
    updater: (currentUser: AdminUserProfileRecord) => AdminUserProfileRecord,
    message: string,
  ) {
    setIsMutating(true);
    startTransition(() => {
      setUser((currentUser) =>
        currentUser ? updater(currentUser) : currentUser,
      );
      setLastActionMessage(message);
      setIsMutating(false);
    });
  }

  function suspendUser() {
    applyMockAction(
      (currentUser) => ({ ...currentUser, status: "suspended" }),
      "User marked as suspended locally. Connect this action to the future admin mutation when the API is ready.",
    );
  }

  function reactivateUser() {
    applyMockAction(
      (currentUser) => ({ ...currentUser, status: "active" }),
      "User reactivated locally. Future server wiring can replace this mock account change.",
    );
  }

  function toggleRole() {
    if (!user) {
      return;
    }

    const nextRole = user.role === "admin" ? "user" : "admin";

    applyMockAction(
      (currentUser) => ({ ...currentUser, role: nextRole }),
      nextRole === "admin"
        ? "Role updated to admin locally. This control is ready for a future role-management mutation."
        : "Role updated to user locally. This control is ready for a future role-management mutation.",
    );
  }

  return {
    isMutating,
    lastActionMessage,
    reactivateUser,
    suspendUser,
    toggleRole,
    user,
  };
}
