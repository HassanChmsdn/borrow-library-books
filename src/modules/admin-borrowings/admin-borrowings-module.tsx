"use client";

import {
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
  AdminSearchBar,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

import {
  BorrowingsCardList,
  BorrowingManagementDialog,
  BorrowingsTable,
  BorrowingsTabs,
} from "./components";
import { useManagedAdminBorrowingsState } from "./hooks";
import { adminBorrowingsTabLabels } from "./mock-data";
import type { AdminBorrowingsModuleProps } from "./types";

function AdminBorrowingsModule({
  isLoading = false,
  onApproveBorrowing: _onApproveBorrowing,
  onManageBorrowing: _onManageBorrowing,
  onMarkReturned: _onMarkReturned,
  onRejectBorrowing: _onRejectBorrowing,
  onSendReminder,
  records: sourceRecords,
}: AdminBorrowingsModuleProps) {
  const { translateText } = useI18n();
  const {
    activeTab,
    approveBorrowing,
    clearSearch,
    closeManagementDialog,
    feedback,
    hasSearchValue,
    isManagingBorrowing,
    markReturned,
    manageBorrowing,
    managedRecord,
    openManagementDialog,
    records,
    recordsInActiveTabCount,
    rejectBorrowing,
    searchValue,
    setActiveTab,
    setSearchValue,
    tabs,
  } = useManagedAdminBorrowingsState(sourceRecords);

  if (isLoading) {
    return <AdminBorrowingsLoadingState />;
  }

  const isEmptyTab = recordsInActiveTabCount === 0;
  const isNoResults = recordsInActiveTabCount > 0 && records.length === 0;
  const emptyStateByTab = {
    active: {
      description:
        "Borrowing records in the active queue will appear here once circulation data is available.",
      title: "No active borrowings",
    },
    overdue: {
      description:
        "Borrowing records in the overdue queue will appear here once circulation data is available.",
      title: "No overdue borrowings",
    },
    pending: {
      description:
        "Borrowing records in the pending queue will appear here once circulation data is available.",
      title: "No pending borrowings",
    },
    returned: {
      description:
        "Borrowing records in the returned queue will appear here once circulation data is available.",
      title: "No returned borrowings",
    },
  } as const;

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
              {translateText("Clear search")}
            </Button>
          ) : null
        }
      >
        {feedback ? (
          <div
            className={
              feedback.tone === "success"
                ? "rounded-card border border-success/20 bg-success/5 px-4 py-3"
                : "rounded-card border border-danger/20 bg-danger-surface px-4 py-3"
            }
          >
            <p
              className={
                feedback.tone === "success"
                  ? "text-body-sm text-foreground font-medium"
                  : "text-body-sm text-danger font-medium"
              }
            >
              {translateText(feedback.message)}
            </p>
          </div>
        ) : null}

        {isEmptyTab ? (
          <AdminEmptyState
            title={emptyStateByTab[activeTab].title}
            description={emptyStateByTab[activeTab].description}
          />
        ) : isNoResults ? (
          <AdminEmptyState
            title="No borrowings match this search"
            description="Try a different member name, book title, email, or branch to find the borrowing record you need."
            action={
              <Button type="button" size="sm" variant="outline" onClick={clearSearch}>
                {translateText("Reset search")}
              </Button>
            }
          />
        ) : (
          <>
            <BorrowingsCardList
              records={records}
              onApproveBorrowing={approveBorrowing}
              onManageBorrowing={openManagementDialog}
              onMarkReturned={markReturned}
              onRejectBorrowing={rejectBorrowing}
              onSendReminder={onSendReminder}
            />
            <BorrowingsTable
              records={records}
              onApproveBorrowing={approveBorrowing}
              onManageBorrowing={openManagementDialog}
              onMarkReturned={markReturned}
              onRejectBorrowing={rejectBorrowing}
              onSendReminder={onSendReminder}
            />
          </>
        )}
      </AdminDataTable>

      <BorrowingManagementDialog
        open={managedRecord !== null}
        pending={isManagingBorrowing}
        record={managedRecord}
        onOpenChange={(open) => {
          if (!open) {
            closeManagementDialog();
          }
        }}
        onSubmit={manageBorrowing}
      />
    </div>
  );
}

function AdminBorrowingsLoadingState() {
  const { translateText } = useI18n();

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow={translateText("Circulation")}
        title={translateText("Borrowing operations")}
        description={translateText("Loading borrowing operations surfaces.")}
      />
      <LoadingSkeleton count={2} variant="card" className="lg:hidden" />
      <LoadingSkeleton count={1} variant="table" />
    </div>
  );
}

export { AdminBorrowingsLoadingState, AdminBorrowingsModule };
