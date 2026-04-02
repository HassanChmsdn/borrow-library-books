"use client";

import { Search } from "lucide-react";

import { LoadingSkeleton } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <PageHeader
        eyebrow="Members"
        title="User management"
        description="Review member status, cash balances, and borrowing posture using typed mock data and shared admin presentation primitives."
      >
        <div className="rounded-card border-border-subtle bg-card grid gap-4 border p-4 shadow-xs sm:p-5">
          <label className="relative block">
            <span className="sr-only">Search members</span>
            <Search className="text-text-tertiary pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search member, email, or branch..."
              className="pl-11"
            />
          </label>
          <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2">
              {filters.map((filter) => {
                const isActive = filter.value === activeFilter;

                return (
                  <Button
                    key={filter.value}
                    size="sm"
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    onClick={() => setActiveFilter(filter.value)}
                  >
                    {filter.label}
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
            Member roster
          </h2>
          <p className="text-body-sm text-text-secondary">
            Responsive member management surfaces optimized for dense desktop
            review and mobile check-ins.
          </p>
        </div>

        {records.length > 0 ? (
          <>
            <AdminUsersMobileList records={records} />
            <AdminUsersDesktopTable records={records} />
          </>
        ) : (
          <AdminUsersEmptyState />
        )}
      </section>
    </div>
  );
}

function AdminUsersLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
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
