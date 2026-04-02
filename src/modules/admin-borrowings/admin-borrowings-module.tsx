"use client";

import {
  AdminDataTable,
  AdminPageHeader,
  AdminSearchBar,
  AdminTabs,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";

import {
  AdminBorrowingsDesktopTable,
  AdminBorrowingsEmptyState,
  AdminBorrowingsMobileList,
} from "./components";
import { useAdminBorrowingsModuleState } from "./hooks";

function AdminBorrowingsModule() {
  const {
    activeTab,
    records,
    searchValue,
    setActiveTab,
    setSearchValue,
    tabs,
  } = useAdminBorrowingsModuleState();

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Circulation"
        title="Borrowing operations"
        description="Manage active loans, pending pickups, returns, and overdue items with the same mobile-first layout logic used across the rest of the app."
        controls={
          <>
            <AdminSearchBar
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              label="Search borrowing records"
              placeholder="Search member, book, or branch..."
            />
            <AdminTabs
              items={tabs.map((tab) => ({
                label: tab.label,
                value: tab.value,
              }))}
              value={activeTab}
              onValueChange={setActiveTab}
            />
          </>
        }
      ></AdminPageHeader>

      <AdminDataTable
        title="Borrowing queue"
        description="Data-heavy desktop table with card fallbacks on mobile, built to accept real circulation data later."
      >
        {records.length > 0 ? (
          <>
            <AdminBorrowingsMobileList records={records} />
            <AdminBorrowingsDesktopTable records={records} />
          </>
        ) : (
          <AdminBorrowingsEmptyState activeTab={activeTab} />
        )}
      </AdminDataTable>
    </div>
  );
}

function AdminBorrowingsLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Circulation"
        title="Borrowing operations"
        description="Loading borrowing operations surfaces."
      />
      <LoadingSkeleton count={4} variant="card" className="xl:grid-cols-4" />
      <LoadingSkeleton count={2} variant="table" className="xl:grid-cols-2" />
    </div>
  );
}

export { AdminBorrowingsLoadingState, AdminBorrowingsModule };
