import type * as React from "react";
import { Shield } from "lucide-react";

import { AdminFilterSelect, AdminSearchBar } from "@/components/admin";

import type { AdminUsersRoleFilter } from "../types";

interface UsersToolbarProps {
  action?: React.ReactNode;
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
  action,
  onRoleChange,
  onSearchChange,
  roleOptions,
  roleValue,
  searchValue,
}: Readonly<UsersToolbarProps>) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem_auto] lg:items-end">
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
      {action ? <div className="lg:justify-self-end">{action}</div> : null}
    </div>
  );
}

export { UsersToolbar, type UsersToolbarProps };