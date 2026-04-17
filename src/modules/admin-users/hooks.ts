"use client";

import {
  startTransition,
  useEffect,
  useDeferredValue,
  useState,
} from "react";

import {
  createMockAdminUserRecord,
  adminUserRecords,
  adminUsersRoleOptions,
} from "./mock-data";
import { getAppRoleDisplayLabel } from "@/lib/auth/roles";
import type {
  AdminUserFormValues,
  AdminUserProfileRecord,
  AdminUserRecord,
  AdminUserRole,
  AdminUsersRoleFilter,
} from "./types";

interface AdminUsersFeedbackState {
  message: string;
  tone: "danger" | "success";
}

export function useAdminUsersModuleState(
  inputRecords: ReadonlyArray<AdminUserRecord> = adminUserRecords,
) {
  const [records, setRecords] = useState(inputRecords);
  const [createFeedback, setCreateFeedback] =
    useState<AdminUsersFeedbackState | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [roleFilter, setRoleFilter] = useState<AdminUsersRoleFilter>("all");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setRecords(inputRecords);
  }, [inputRecords]);

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const filteredRecords = records.filter((record) => {
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

  function dismissCreateFeedback() {
    setCreateFeedback(null);
  }

  async function submitCreateUser(values: AdminUserFormValues) {
    setIsCreatingUser(true);
    setCreateFeedback(null);

    await new Promise((resolve) => window.setTimeout(resolve, 350));

    const normalizedEmail = values.email.trim().toLowerCase();
    const duplicateRecord = records.find(
      (record) => record.email.toLowerCase() === normalizedEmail,
    );

    if (duplicateRecord) {
      setCreateFeedback({
        message:
          "A user with that email already exists in the mocked roster. Change the email to simulate a new account.",
        tone: "danger",
      });
      setIsCreatingUser(false);
      return false;
    }

    const nextRecord = createMockAdminUserRecord(values);

    setRecords((current) => [nextRecord, ...current]);
    setCreateFeedback({
      message:
        "User created locally. This mocked flow is ready to be replaced by a future Auth0 and MongoDB-backed create-user mutation.",
      tone: "success",
    });
    setIsCreateDialogOpen(false);
    setIsCreatingUser(false);
    return true;
  }

  return {
    clearFilters,
    createFeedback,
    dismissCreateFeedback,
    filteredRecords,
    hasActiveFilters: roleFilter !== "all" || searchValue.trim().length > 0,
    isCreateDialogOpen,
    isCreatingUser,
    recordsCount: records.length,
    roleFilter,
    roleOptions: adminUsersRoleOptions,
    searchValue,
    setCreateDialogOpen: setIsCreateDialogOpen,
    setRoleFilter,
    setSearchValue,
    submitCreateUser,
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

  function changeRole(nextRole: AdminUserRole) {
    if (!user) {
      return;
    }

    if (nextRole === user.role) {
      return;
    }

    applyMockAction(
      (currentUser) => ({ ...currentUser, role: nextRole }),
      `Role updated to ${getAppRoleDisplayLabel(nextRole)} locally. This control is ready for a future role-management mutation.`,
    );
  }

  return {
    isMutating,
    lastActionMessage,
    changeRole,
    reactivateUser,
    suspendUser,
    user,
  };
}
