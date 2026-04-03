"use client";

import {
  AdminDataTable,
  AdminPageHeader,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { Button } from "@/components/ui/button";

import {
  BooksTable,
  BooksToolbar,
} from "./components";
import { useAdminBooksModuleState } from "./hooks";
import type { AdminBooksModuleProps } from "./types";

function AdminBooksModule({
  isLoading = false,
  onAddBook,
  onDeleteBook,
  onEditBook,
  records,
}: AdminBooksModuleProps) {
  const {
    allRecordsCount,
    books,
    categories,
    category,
    clearFilters,
    hasActiveFilters,
    searchValue,
    setCategory,
    setSearchValue,
  } = useAdminBooksModuleState(records);

  if (isLoading) {
    return <AdminBooksLoadingState />;
  }

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Book management"
        description="Manage titles, copy availability, and borrowing fees in a dense but readable catalog workspace prepared for future backend workflows."
        actions={
          <Button size="sm" type="button" onClick={onAddBook}>
            Add book
          </Button>
        }
        controls={
          <BooksToolbar
            categories={categories}
            category={category}
            onCategoryChange={setCategory}
            onSearchValueChange={setSearchValue}
            searchValue={searchValue}
            totalCount={allRecordsCount}
            visibleCount={books.length}
          />
        }
      />

      <AdminDataTable
        title="Library catalog"
        description="A responsive management table for book records, borrowing fees, and copy availability."
        actions={
          hasActiveFilters ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          ) : null
        }
      >
        <BooksTable
          books={books}
          hasActiveFilters={hasActiveFilters}
          onAddBook={onAddBook}
          onClearFilters={clearFilters}
          onDeleteBook={onDeleteBook}
          onEditBook={onEditBook}
          totalRecords={allRecordsCount}
        />
      </AdminDataTable>
    </div>
  );
}

function AdminBooksLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Book management"
        description="Loading catalog management surfaces."
      />
      <LoadingSkeleton count={1} variant="table" />
      <LoadingSkeleton count={2} variant="card" className="lg:hidden" />
    </div>
  );
}

export { AdminBooksLoadingState, AdminBooksModule };
