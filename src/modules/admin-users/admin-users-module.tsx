"use client";

import { Plus } from "lucide-react";

import {
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { Button } from "@/components/ui/button";

import {
  UserFormDialog,
  UsersCardList,
  UsersTable,
  UsersToolbar,
} from "./components";
import { useAdminUsersModuleState } from "./hooks";
import { adminUserFormDefaults, adminUserRecords } from "./mock-data";

import type { AdminUsersModuleProps } from "./types";

function AdminUsersModule({
  isLoading = false,
  records = adminUserRecords,
}: Readonly<AdminUsersModuleProps>) {
  const {
    clearFilters,
    createFeedback,
    dismissCreateFeedback,
    filteredRecords,
    hasActiveFilters,
    isCreateDialogOpen,
    isCreatingUser,
    recordsCount,
    roleFilter,
    roleOptions,
    searchValue,
    setCreateDialogOpen,
    setRoleFilter,
    setSearchValue,
    submitCreateUser,
  } = useAdminUsersModuleState(records);

  if (isLoading) {
    return <AdminUsersLoadingState />;
  }

  const isEmpty = recordsCount === 0;
  const isNoResults = recordsCount > 0 && filteredRecords.length === 0;
  const submissionError =
    createFeedback?.tone === "danger" ? createFeedback.message : null;

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Members"
        title="User management"
        description="Review member roles, account health, and borrowing posture through a responsive staff roster built for future profile management flows."
        controls={
          <UsersToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            roleValue={roleFilter}
            roleOptions={roleOptions}
            onRoleChange={setRoleFilter}
            action={
              <Button
                type="button"
                onClick={() => {
                  dismissCreateFeedback();
                  setCreateDialogOpen(true);
                }}
              >
                <Plus aria-hidden="true" className="size-4" />
                Add user
              </Button>
            }
          />
        }
      />

      {createFeedback?.tone === "success" ? (
        <div className="rounded-card border border-success/20 bg-success/5 flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-body-sm text-foreground font-medium">
              Mocked user created
            </p>
            <p className="text-body-sm text-text-secondary">
              {createFeedback.message}
            </p>
          </div>
          <Button type="button" size="sm" variant="ghost" onClick={dismissCreateFeedback}>
            Dismiss
          </Button>
        </div>
      ) : null}

      <AdminDataTable
        title="Library members"
        description="Desktop favors a dense roster table while mobile keeps the same hierarchy in stacked cards for quick staff review."
        actions={
          hasActiveFilters ? (
            <Button type="button" size="sm" variant="ghost" onClick={clearFilters}>
              Reset filters
            </Button>
          ) : null
        }
      >
        {isEmpty ? (
          <AdminEmptyState
            title="No members are available yet"
            description="Once member records are connected or imported, this roster will support role filtering, account review, and profile navigation."
          />
        ) : isNoResults ? (
          <AdminEmptyState
            title="No members match the current filters"
            description="Try another name, email, or role filter to bring matching staff and reader accounts back into view."
            action={
              <Button type="button" size="sm" variant="outline" onClick={clearFilters}>
                Clear search and role
              </Button>
            }
          />
        ) : (
          <>
            <UsersCardList users={filteredRecords} />
            <UsersTable users={filteredRecords} />
          </>
        )}
      </AdminDataTable>

      <UserFormDialog
        initialValues={adminUserFormDefaults}
        isSubmitting={isCreatingUser}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open && submissionError) {
            dismissCreateFeedback();
          }
        }}
        onSubmit={submitCreateUser}
        open={isCreateDialogOpen}
        submissionError={submissionError}
      />
    </div>
  );
}

function AdminUsersLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Members"
        title="User management"
        description="Loading member management surfaces."
      />
      <LoadingSkeleton count={2} variant="card" className="lg:hidden" />
      <LoadingSkeleton count={1} variant="table" />
    </div>
  );
}

export { AdminUsersLoadingState, AdminUsersModule };
