"use client";

import { Search } from "lucide-react";

import { LoadingSkeleton } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <PageHeader
        eyebrow="Circulation"
        title="Borrowing operations"
        description="Manage active loans, pending pickups, returns, and overdue items with the same mobile-first layout logic used across the rest of the app."
      >
        <div className="rounded-card border-border-subtle bg-card grid gap-4 border p-4 shadow-xs sm:p-5">
          <label className="relative block">
            <span className="sr-only">Search borrowing records</span>
            <Search className="text-text-tertiary pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search member, book, or branch..."
              className="pl-11"
            />
          </label>
          <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2">
              {tabs.map((tab) => {
                const isActive = tab.value === activeTab;

                return (
                  <Button
                    key={tab.value}
                    size="sm"
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </PageHeader>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-title-sm text-foreground font-semibold">
            Borrowing queue
          </h2>
          <p className="text-body-sm text-text-secondary">
            Data-heavy desktop table with card fallbacks on mobile, built to
            accept real circulation data later.
          </p>
        </div>

        {records.length > 0 ? (
          <>
            <AdminBorrowingsMobileList records={records} />
            <AdminBorrowingsDesktopTable records={records} />
          </>
        ) : (
          <AdminBorrowingsEmptyState activeTab={activeTab} />
        )}
      </section>
    </div>
  );
}

function AdminBorrowingsLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
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
