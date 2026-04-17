import {
  AdminRowActions,
  AdminTableCell,
  AdminTableRow,
  AdminUserAvatar,
} from "@/components/admin";

import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";

import type { AdminUserRecord } from "../types";

interface UserTableRowProps {
  canManage: boolean;
  user: AdminUserRecord;
}

function UserTableRow({ canManage, user }: Readonly<UserTableRowProps>) {
  const actions = canManage && user.profileHref
    ? [
        {
          label: "Open profile",
          href: user.profileHref,
          variant: "ghost" as const,
        },
      ]
    : canManage ? [
        {
          label: "Profile pending",
          disabled: true,
          variant: "ghost" as const,
        },
      ] : [];

  return (
    <AdminTableRow>
      <AdminTableCell>
        <AdminUserAvatar
          size="sm"
          name={user.fullName}
          subtitle={user.email}
        />
      </AdminTableCell>
      <AdminTableCell>
        <UserRoleBadge role={user.role} />
      </AdminTableCell>
      <AdminTableCell>
        <UserStatusBadge status={user.status} />
      </AdminTableCell>
      <AdminTableCell className="text-body-sm text-text-secondary">
        {user.joinedDateLabel}
      </AdminTableCell>
      <AdminTableCell>
        <div className="space-y-1">
          <p className="text-body-sm text-foreground font-medium">
            {user.borrowingSummaryLabel}
          </p>
          <p className="text-body-sm text-text-secondary">
            {user.borrowingSummaryMeta}
          </p>
        </div>
      </AdminTableCell>
      <AdminTableCell className="text-right">
        {canManage ? (
          <AdminRowActions align="end" actions={actions} />
        ) : (
          <p className="text-body-sm text-text-tertiary">View only</p>
        )}
      </AdminTableCell>
    </AdminTableRow>
  );
}

export { UserTableRow, type UserTableRowProps };