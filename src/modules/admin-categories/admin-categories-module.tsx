"use client";

import {
  AdminDataTable,
  AdminPageHeader,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { Button } from "@/components/ui/button";
import { useCanManageAdminSection } from "@/lib/auth/react";

import { CategoriesTable, CategoriesToolbar, CategoryFormDialog } from "./components";
import { getAdminCategoryDefaultValues } from "./mock-data";
import { useAdminCategoriesModuleState } from "./hooks";
import type { AdminCategoriesModuleProps } from "./types";

function AdminCategoriesModule({
  initialRecords,
  isLoading = false,
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
  searchQuery,
}: AdminCategoriesModuleProps) {
  const canManageCategories = useCanManageAdminSection("categories");
  const {
    deleteCategory,
    dialogState,
    filteredRecords,
    hasNoResults,
    isSubmitting,
    openCreateDialog,
    openEditDialog,
    resetDialog,
    searchValue,
    setSearchValue,
    submitCategory,
    records,
  } = useAdminCategoriesModuleState({
    initialRecords,
    onCreateCategory,
    onDeleteCategory,
    onUpdateCategory,
    searchQuery,
  });

  if (isLoading) {
    return <AdminCategoriesLoadingState />;
  }

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Collections"
        title="Category management"
        description="Organize browse groupings, keep collection descriptions consistent, and prepare category records for future CRUD-backed staff workflows."
        actions={
          canManageCategories ? (
            <Button size="sm" type="button" onClick={openCreateDialog}>
              Add category
            </Button>
          ) : undefined
        }
        controls={
          <CategoriesToolbar
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            totalCount={records.length}
            visibleCount={filteredRecords.length}
          />
        }
      />

      <AdminDataTable
        title="Category records"
        description="Manage browse labels and optional descriptions in the same responsive table pattern used across the admin workspace."
        actions={
          hasNoResults ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setSearchValue("")}
            >
              Clear search
            </Button>
          ) : null
        }
      >
        <CategoriesTable
          categories={filteredRecords}
          canManage={canManageCategories}
          hasActiveFilters={searchValue.trim().length > 0}
          onAddCategory={canManageCategories ? openCreateDialog : undefined}
          onClearFilters={() => setSearchValue("")}
          onDeleteCategory={canManageCategories ? deleteCategory : undefined}
          onEditCategory={canManageCategories ? openEditDialog : undefined}
          totalRecords={records.length}
        />
      </AdminDataTable>

      {canManageCategories && dialogState ? (
        <CategoryFormDialog
          open
          mode={dialogState.mode}
          initialValues={getAdminCategoryDefaultValues(dialogState.record)}
          isSubmitting={isSubmitting}
          onOpenChange={(open) => {
            if (!open) {
              resetDialog();
            }
          }}
          onSubmit={submitCategory}
        />
      ) : null}
    </div>
  );
}

function AdminCategoriesLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Collections"
        title="Category management"
        description="Loading category management surfaces."
      />
      <LoadingSkeleton count={2} variant="card" className="lg:hidden" />
      <LoadingSkeleton count={1} variant="table" />
    </div>
  );
}

export { AdminCategoriesLoadingState, AdminCategoriesModule };
