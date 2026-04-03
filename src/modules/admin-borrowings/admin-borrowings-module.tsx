"use client";

import {
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
  AdminSearchBar,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { Button } from "@/components/ui/button";

import {
  BorrowingsCardList,
  BorrowingsTable,
  BorrowingsTabs,
} from "./components";
import { useAdminBorrowingsState } from "./hooks";
import { adminBorrowingsTabLabels } from "./mock-data";
import type { AdminBorrowingsModuleProps } from "./types";

function AdminBorrowingsModule({
  isLoading = false,
  onApproveBorrowing,
  onMarkReturned,
  onRejectBorrowing,
  onSendReminder,
  records: sourceRecords,
}: AdminBorrowingsModuleProps) {
  const {
    activeTab,
    clearSearch,
    hasSearchValue,
    records,
    recordsInActiveTabCount,
    searchValue,
    setActiveTab,
    setSearchValue,
    tabs,
  } = useAdminBorrowingsState(sourceRecords);

  if (isLoading) {
    return <AdminBorrowingsLoadingState />;
  }

  const isEmptyTab = recordsInActiveTabCount === 0;
  const isNoResults = recordsInActiveTabCount > 0 && records.length === 0;

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Circulation"
        title="Borrowing operations"
        description="Review pending approvals, active loans, overdue follow-up, and returned records in a dense but readable circulation workspace."
        controls={
          <div className="grid gap-3">
            <AdminSearchBar
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              label="Search borrowing records"
              placeholder="Search book, member, email, or branch..."
            />
            <BorrowingsTabs
              items={tabs}
              value={activeTab}
              onValueChange={setActiveTab}
            />
          </div>
        }
      />

      <AdminDataTable
        title="Borrowing queue"
        description="Desktop uses a dense management table, while mobile falls back to stacked operational cards with the same status, fee, and action hierarchy."
        actions={
          hasSearchValue ? (
            <Button type="button" size="sm" variant="ghost" onClick={clearSearch}>
              Clear search
            </Button>
          ) : null
        }
      >
        {isEmptyTab ? (
          <AdminEmptyState
            title={`No ${adminBorrowingsTabLabels[activeTab].toLowerCase()} borrowings`}
            description={`Borrowing records in the ${adminBorrowingsTabLabels[activeTab].toLowerCase()} queue will appear here once circulation data is available.`}
          />
        ) : isNoResults ? (
          <AdminEmptyState
            title="No borrowings match this search"
            description="Try a different member name, book title, email, or branch to find the borrowing record you need."
            action={
              <Button type="button" size="sm" variant="outline" onClick={clearSearch}>
                Reset search
              </Button>
            }
          />
        ) : (
          <>
            <BorrowingsCardList
              records={records}
              onApproveBorrowing={onApproveBorrowing}
              onMarkReturned={onMarkReturned}
              onRejectBorrowing={onRejectBorrowing}
              onSendReminder={onSendReminder}
            />
            <BorrowingsTable
              records={records}
              onApproveBorrowing={onApproveBorrowing}
              onMarkReturned={onMarkReturned}
              onRejectBorrowing={onRejectBorrowing}
              onSendReminder={onSendReminder}
            />
          </>
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
      <LoadingSkeleton count={2} variant="card" className="lg:hidden" />
      <LoadingSkeleton count={1} variant="table" />
    </div>
  );
}

export { AdminBorrowingsLoadingState, AdminBorrowingsModule };
