import {
  AdminDetailSection,
  AdminRowActions,
  AdminUserAvatar,
} from "@/components/admin";
import { Card, CardContent } from "@/components/ui/card";

import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";

import type { AdminUserRecord } from "../types";

interface UsersCardListProps {
  canManage: boolean;
  users: ReadonlyArray<AdminUserRecord>;
}

function UsersCardList({ canManage, users }: Readonly<UsersCardListProps>) {
  return (
    <div className="grid gap-3 lg:hidden">
      {users.map((user) => {
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
          <Card key={user.id}>
            <CardContent className="grid gap-4 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <AdminUserAvatar name={user.fullName} subtitle={user.email} />
                <div className="flex flex-wrap justify-end gap-2">
                  <UserRoleBadge role={user.role} />
                  <UserStatusBadge status={user.status} />
                </div>
              </div>

              <AdminDetailSection
                items={[
                  { label: "Joined", value: user.joinedDateLabel },
                  {
                    label: "Borrowing",
                    value: (
                      <div className="space-y-1 text-right sm:text-left">
                        <p className="text-body-sm text-foreground font-medium">
                          {user.borrowingSummaryLabel}
                        </p>
                        <p className="text-body-sm text-text-secondary">
                          {user.borrowingSummaryMeta}
                        </p>
                      </div>
                    ),
                  },
                ]}
              />

              {canManage ? (
                <AdminRowActions align="end" actions={actions} />
              ) : (
                <p className="text-body-sm text-text-tertiary text-right">View only</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export { UsersCardList, type UsersCardListProps };