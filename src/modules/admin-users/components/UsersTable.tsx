import {
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin";

import { UserTableRow } from "./UserTableRow";

import type { AdminUserRecord } from "../types";

interface UsersTableProps {
  canManage: boolean;
  users: ReadonlyArray<AdminUserRecord>;
}

function UsersTable({ canManage, users }: Readonly<UsersTableProps>) {
  return (
    <div className="hidden lg:block">
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>User</AdminTableHead>
            <AdminTableHead>Role</AdminTableHead>
            <AdminTableHead>Status</AdminTableHead>
            <AdminTableHead>Joined</AdminTableHead>
            <AdminTableHead>Borrowing summary</AdminTableHead>
            <AdminTableHead className="text-right">
              {canManage ? "Action" : "Access"}
            </AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {users.map((user) => (
            <UserTableRow key={user.id} canManage={canManage} user={user} />
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}

export { UsersTable, type UsersTableProps };