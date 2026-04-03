import {
  AdminDetailSection,
  AdminSectionCard,
  ConfirmActionDialog,
} from "@/components/admin";
import { Button } from "@/components/ui/button";

import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";

import type { AdminUserRole, AdminUserStatus } from "../types";

interface UserAccountActionsProps {
  isMutating?: boolean;
  lastActionMessage?: string | null;
  onChangeRole?: () => void;
  onReactivateUser?: () => void;
  onSuspendUser?: () => void;
  role: AdminUserRole;
  status: AdminUserStatus;
}

function UserAccountActions({
  isMutating = false,
  lastActionMessage,
  onChangeRole,
  onReactivateUser,
  onSuspendUser,
  role,
  status,
}: Readonly<UserAccountActionsProps>) {
  const roleActionLabel = role === "admin" ? "Change to user" : "Promote to admin";

  return (
    <AdminSectionCard
      title="Account actions"
      description="Mock account controls ready to connect to future staff mutations."
    >
      <AdminDetailSection
        columns={2}
        className="sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"
        items={[
          {
            label: "Current role",
            value: <UserRoleBadge role={role} />,
          },
          {
            label: "Current status",
            value: <UserStatusBadge status={status} />,
          },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {status === "active" ? (
          <ConfirmActionDialog
            title="Suspend this user?"
            description="This mock action updates the local profile state and prepares the flow for a future suspension endpoint."
            confirmLabel="Suspend user"
            trigger={
              <Button type="button" variant="destructive" disabled={isMutating}>
                Suspend user
              </Button>
            }
            onConfirm={onSuspendUser}
          />
        ) : (
          <Button type="button" disabled={isMutating} onClick={onReactivateUser}>
            Reactivate user
          </Button>
        )}

        <ConfirmActionDialog
          title="Change account role?"
          description="This mock action updates the local role state so the layout is ready for future admin role-management APIs."
          confirmLabel={roleActionLabel}
          tone="default"
          trigger={
            <Button type="button" variant="outline" disabled={isMutating}>
              {roleActionLabel}
            </Button>
          }
          onConfirm={onChangeRole}
        />
      </div>

      <p className="text-body-sm text-text-secondary">
        {lastActionMessage ??
          "Suspend, reactivate, and role-change actions are mocked locally for now and can later be replaced by real staff mutations."}
      </p>
    </AdminSectionCard>
  );
}

export { UserAccountActions, type UserAccountActionsProps };