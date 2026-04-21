"use client";

import { ArrowLeft } from "lucide-react";

import {
  AdminEmptyState,
  AdminPageHeader,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { LinkButton } from "@/components/ui/link-button";
import {
  canManageAppUserRecord,
  getAssignableAppUserRoles,
} from "@/lib/auth";
import { useMockAuthContext } from "@/lib/auth/react";

import { useAdminUserProfileState } from "./hooks";
import { getAdminUserRoleFieldOptions } from "./mock-data";
import type { AdminUserProfileModuleProps } from "./types";
import {
  UserAccountActions,
  UserBorrowingHistory,
  UserProfileSummary,
  UserRoleBadge,
  UserStatusBadge,
} from "./components";

function AdminUserProfileModule({
  initialUser,
  isLoading = false,
}: Readonly<AdminUserProfileModuleProps>) {
  const {
    isMutating,
    lastActionMessage,
    changeRole,
    reactivateUser,
    suspendUser,
    user,
  } = useAdminUserProfileState(initialUser);
  const authState = useMockAuthContext();

  if (isLoading) {
    return <AdminUserProfileLoadingState />;
  }

  if (!user) {
    return <AdminUserProfileEmptyState />;
  }

  const canManageAccount = canManageAppUserRecord(authState, user.role);
  const roleOptions = getAdminUserRoleFieldOptions(
    getAssignableAppUserRoles(authState),
  );

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Accounts"
        title={user.fullName}
        description="Review account posture, live circulation exposure, and staff actions from one account management screen built for future server integration."
        actions={
          <LinkButton href="/admin/users" size="sm" variant="outline">
            <ArrowLeft className="size-4" />
            Back to users
          </LinkButton>
        }
        controls={
          <div className="flex flex-wrap items-center gap-2">
            <UserRoleBadge role={user.role} />
            <UserStatusBadge status={user.status} />
          </div>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:items-start">
        <div className="grid gap-5">
          <UserProfileSummary user={user} />
          <UserAccountActions
            canChangeRole={canManageAccount}
            canChangeStatus={canManageAccount}
            isMutating={isMutating}
            lastActionMessage={lastActionMessage}
            onChangeRole={changeRole}
            onReactivateUser={reactivateUser}
            onSuspendUser={suspendUser}
            roleOptions={roleOptions}
            role={user.role}
            status={user.status}
          />
        </div>

        <div className="grid gap-5">
          <UserBorrowingHistory
            title="Current borrowings"
            description="Live circulation items currently attached to this account, including overdue exposure and onsite cash reminders where relevant."
            records={user.currentBorrowings}
            emptyTitle="No current borrowings"
            emptyDescription="This account does not currently hold any active or pending circulation items."
          />

          <UserBorrowingHistory
            title="Borrowing history"
            description="Recent completed borrowing records to support staff review and future profile management actions."
            records={user.borrowingHistory}
            emptyTitle="No borrowing history"
            emptyDescription="History entries will appear here once this account completes or settles previous borrowing activity."
          />
        </div>
      </section>
    </div>
  );
}

function AdminUserProfileEmptyState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Accounts"
        title="User profile"
        description="The selected account could not be found in the current mock admin roster."
      />

      <AdminEmptyState
        title="User not found"
        description="Return to the users management page and choose another record. This fallback is local so the route can be safely refined before backend wiring exists."
        action={
          <LinkButton href="/admin/users">Back to users</LinkButton>
        }
      />
    </div>
  );
}

function AdminUserProfileLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Members"
        title="User profile"
        description="Preparing the account summary, circulation history, and admin action panels."
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <div className="grid gap-5">
          <LoadingSkeleton count={2} variant="card" />
        </div>
        <div className="grid gap-5">
          <LoadingSkeleton count={2} variant="card" />
        </div>
      </section>
    </div>
  );
}

export {
  AdminUserProfileEmptyState,
  AdminUserProfileLoadingState,
  AdminUserProfileModule,
};