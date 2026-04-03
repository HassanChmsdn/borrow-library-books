import type * as React from "react";
import { Shield } from "lucide-react";

import { AdminFilterSelect, AdminSearchBar } from "@/components/admin";

import type { AdminUsersRoleFilter } from "../types";

interface UsersToolbarProps {
  onRoleChange: (value: AdminUsersRoleFilter) => void;
  onSearchChange: (value: string) => void;
  roleOptions: ReadonlyArray<{
    label: React.ReactNode;
    value: AdminUsersRoleFilter;
  }>;
  roleValue: AdminUsersRoleFilter;
  searchValue: string;
}

function UsersToolbar({
  onRoleChange,
  onSearchChange,
  roleOptions,
  roleValue,
  searchValue,
}: Readonly<UsersToolbarProps>) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end">
      <AdminSearchBar
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        label="Search members"
        placeholder="Search by name, email, or borrowing summary..."
      />
      <AdminFilterSelect
        label="Role"
        options={roleOptions}
        value={roleValue}
        onValueChange={onRoleChange}
        leadingIcon={<Shield aria-hidden="true" className="size-4" />}
      />
    </div>
  );
}

export { UsersToolbar, type UsersToolbarProps };