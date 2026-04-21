"use client";

import * as React from "react";

import {
  AdminFilterSelect,
  AdminDetailSection,
  AdminSectionCard,
  ConfirmActionDialog,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";

import type { AdminUserRole, AdminUserStatus } from "../types";

interface UserAccountActionsProps {
  canChangeRole?: boolean;
  canChangeStatus?: boolean;
  isMutating?: boolean;
  lastActionMessage?: string | null;
  onChangeRole?: (role: AdminUserRole) => void;
  onReactivateUser?: () => void;
  onSuspendUser?: () => void;
  roleOptions: ReadonlyArray<{
    label: React.ReactNode;
    value: AdminUserRole;
  }>;
  role: AdminUserRole;
  status: AdminUserStatus;
}

function UserAccountActions({
  canChangeRole = false,
  canChangeStatus = false,
  isMutating = false,
  lastActionMessage,
  onChangeRole,
  onReactivateUser,
  onSuspendUser,
  roleOptions,
  role,
  status,
}: Readonly<UserAccountActionsProps>) {
  const { translateText } = useI18n();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false);
  const [nextRole, setNextRole] = React.useState(role);

  React.useEffect(() => {
    setNextRole(
      roleOptions.some((option) => option.value === role)
        ? role
        : (roleOptions[0]?.value ?? role),
    );
  }, [role, roleOptions]);

  return (
    <AdminSectionCard
      title={translateText("Account actions")}
      description={translateText(
        "Existing account controls now run through the shared admin user-management flow.",
      )}
    >
      <AdminDetailSection
        columns={2}
        className="sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"
        items={[
          {
            label: translateText("Current role"),
            value: <UserRoleBadge role={role} />,
          },
          {
            label: translateText("Current status"),
            value: <UserStatusBadge status={status} />,
          },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {status === "active" ? (
          <ConfirmActionDialog
            title={translateText("Suspend this user?")}
            description={translateText(
              "Suspend the selected account while preserving its linked identity record and borrowing history.",
            )}
            confirmLabel={translateText("Suspend user")}
            trigger={
              <Button
                type="button"
                variant="destructive"
                disabled={isMutating || !canChangeStatus}
              >
                {translateText("Suspend user")}
              </Button>
            }
            onConfirm={onSuspendUser}
          />
        ) : (
          <Button
            type="button"
            disabled={isMutating || !canChangeStatus}
            onClick={onReactivateUser}
          >
            {translateText("Reactivate user")}
          </Button>
        )}

        <ConfirmActionDialog
          title={translateText("Change account role?")}
          description={translateText(
            "Select the application role that should be assigned to this account. Super-admin assignment remains restricted to explicitly authorized operators.",
          )}
          confirmLabel={translateText("Save role")}
          confirmDisabled={isMutating || !canChangeRole || nextRole === role}
          tone="default"
          open={isRoleDialogOpen}
          onOpenChange={(open) => {
            setIsRoleDialogOpen(open);

            if (!open) {
              setNextRole(role);
            }
          }}
          trigger={
            <Button
              type="button"
              variant="outline"
              disabled={isMutating || !canChangeRole || roleOptions.length === 0}
            >
              {translateText("Change role")}
            </Button>
          }
          onConfirm={() => onChangeRole?.(nextRole)}
        >
          <AdminFilterSelect
            label={translateText("Assigned role")}
            options={roleOptions}
            value={nextRole}
            onValueChange={setNextRole}
          />
        </ConfirmActionDialog>
      </div>

      <p className="text-body-sm text-text-secondary">
        {lastActionMessage ??
          (canChangeRole || canChangeStatus
            ? translateText(
                "Suspend, reactivate, and role changes now use the shared admin user-management actions.",
              )
            : translateText(
                "This account can be reviewed here, but the current session is not allowed to change its role or status.",
              ))}
      </p>
    </AdminSectionCard>
  );
}

export { UserAccountActions, type UserAccountActionsProps };