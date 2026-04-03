"use client";

import { AdminPageHeader } from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { Button } from "@/components/ui/button";

import { CategoriesGrid, CategoryFormDialog } from "./components";
import {
  adminCategoryIconOptions,
  getAdminCategoryDefaultValues,
} from "./mock-data";
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
  const {
    deleteCategory,
    dialogState,
    filteredRecords,
    isSubmitting,
    openCreateDialog,
    openEditDialog,
    resetDialog,
    submitCategory,
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
          <Button size="sm" type="button" onClick={openCreateDialog}>
            Add category
          </Button>
        }
      />

      <CategoriesGrid
        categories={filteredRecords}
        onAddCategory={openCreateDialog}
        onDeleteCategory={deleteCategory}
        onEditCategory={openEditDialog}
        searchQuery={searchQuery}
      />

      {dialogState ? (
        <CategoryFormDialog
          open
          mode={dialogState.mode}
          iconOptions={adminCategoryIconOptions}
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
      <LoadingSkeleton
        count={6}
        variant="card"
        className="sm:grid-cols-2 2xl:grid-cols-3"
      />
    </div>
  );
}

export { AdminCategoriesLoadingState, AdminCategoriesModule };
