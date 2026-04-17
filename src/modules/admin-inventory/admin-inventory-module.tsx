"use client";

import { Plus } from "lucide-react";

import {
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { Button } from "@/components/ui/button";
import { useCanManageAdminSection } from "@/lib/auth/react";

import {
  InventoryCardList,
  InventoryForm,
  InventoryTable,
  InventoryToolbar,
} from "./components";
import { useAdminInventoryModuleState } from "./hooks";

import type { AdminInventoryModuleProps } from "./types";

function AdminInventoryModule({
  bookOptions,
  isLoading = false,
  onSaveCopy,
  records,
}: Readonly<AdminInventoryModuleProps>) {
  const canManageInventory = useCanManageAdminSection("inventory");
  const {
    clearFilters,
    filteredRecords,
    formMode,
    hasActiveFilters,
    inventoryFormInitialValues,
    isFormOpen,
    openCreateForm,
    openEditForm,
    recordsCount,
    saveCopy,
    searchValue,
    setIsFormOpen,
    setSearchValue,
    setStatusFilter,
    statusFilter,
    statusOptions,
  } = useAdminInventoryModuleState(records, { onSaveCopy });

  if (isLoading) {
    return <AdminInventoryLoadingState />;
  }

  const isEmpty = recordsCount === 0;
  const isNoResults = recordsCount > 0 && filteredRecords.length === 0;

  return (
    <>
      <div className="gap-section flex flex-col">
        <AdminPageHeader
          eyebrow="Copies"
          title="Inventory management"
          description="Manage physical copies, copy condition, and circulation readiness in a dense but readable operations workspace."
          controls={
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem_auto] lg:items-end">
              <InventoryToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                statusValue={statusFilter}
                statusOptions={statusOptions}
                onStatusChange={setStatusFilter}
              />
              {canManageInventory ? (
                <Button type="button" size="lg" onClick={openCreateForm}>
                  <Plus aria-hidden="true" className="size-4" />
                  Add copy
                </Button>
              ) : null}
            </div>
          }
        />

        <AdminDataTable
          title="Physical copy roster"
          description="Desktop uses a dense copy table, while mobile falls back to stacked cards that preserve the same hierarchy for status and condition."
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
              title="No inventory copies yet"
              description="Add the first physical copy to start tracking copy condition, status, and circulation readiness."
              action={
                canManageInventory ? (
                  <Button type="button" size="sm" onClick={openCreateForm}>
                    <Plus aria-hidden="true" className="size-4" />
                    Add first copy
                  </Button>
                ) : null
              }
            />
          ) : isNoResults ? (
            <AdminEmptyState
              title="No copies match these filters"
              description="Try another copy code, title, author, or status filter to find the physical record you need."
              action={
                <Button type="button" size="sm" variant="outline" onClick={clearFilters}>
                  Clear search and status
                </Button>
              }
            />
          ) : (
            <>
              <InventoryCardList
                records={filteredRecords}
                onEditCopy={canManageInventory ? openEditForm : undefined}
              />
              <InventoryTable
                records={filteredRecords}
                onEditCopy={canManageInventory ? openEditForm : undefined}
              />
            </>
          )}
        </AdminDataTable>
      </div>

      {canManageInventory ? (
        <InventoryForm
          bookOptions={bookOptions}
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          mode={formMode}
          initialValues={inventoryFormInitialValues}
          onSubmit={saveCopy}
        />
      ) : null}
    </>
  );
}

function AdminInventoryLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Copies"
        title="Inventory management"
        description="Loading inventory management surfaces."
      />
      <LoadingSkeleton count={2} variant="card" className="lg:hidden" />
      <LoadingSkeleton count={1} variant="table" />
    </div>
  );
}

export { AdminInventoryLoadingState, AdminInventoryModule };
