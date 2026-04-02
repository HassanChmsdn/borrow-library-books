"use client";

import {
  AdminDataTable,
  AdminPageHeader,
  AdminSearchBar,
  AdminTabs,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";

import {
  AdminUsersDesktopTable,
  AdminUsersEmptyState,
  AdminUsersMobileList,
} from "./components";
import { useAdminUsersModuleState } from "./hooks";

function AdminUsersModule() {
  const {
    activeFilter,
    filters,
    records,
    searchValue,
    setActiveFilter,
    setSearchValue,
  } = useAdminUsersModuleState();

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Members"
        title="User management"
        description="Review member status, cash balances, and borrowing posture using typed mock data and shared admin presentation primitives."
        controls={
          <>
            <AdminSearchBar
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              label="Search members"
              placeholder="Search member, email, or branch..."
            />
            <AdminTabs
              items={filters.map((filter) => ({
                label: filter.label,
                value: filter.value,
              }))}
              value={activeFilter}
              onValueChange={setActiveFilter}
            />
          </>
        }
      ></AdminPageHeader>

      <AdminDataTable
        title="Member roster"
        description="Responsive member management surfaces optimized for dense desktop review and mobile check-ins."
      >
        {records.length > 0 ? (
          <>
            <AdminUsersMobileList records={records} />
            <AdminUsersDesktopTable records={records} />
          </>
        ) : (
          <AdminUsersEmptyState />
        )}
      </AdminDataTable>
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
      <LoadingSkeleton count={4} variant="card" className="xl:grid-cols-4" />
      <LoadingSkeleton count={2} variant="table" className="xl:grid-cols-2" />
    </div>
  );
}

export { AdminUsersLoadingState, AdminUsersModule };
