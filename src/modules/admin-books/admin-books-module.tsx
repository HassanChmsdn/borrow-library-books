"use client";

import {
  AdminDataTable,
  AdminPageHeader,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { useCanManageAdminSection } from "@/lib/auth/react";

import {
  BooksTable,
  BooksToolbar,
} from "./components";
import { useI18n } from "@/lib/i18n";
import { useAdminBooksModuleState } from "./hooks";
import type { AdminBooksModuleProps } from "./types";

function AdminBooksModule({
  isLoading = false,
  onAddBook,
  onDeleteBook,
  onEditBook,
  records,
}: AdminBooksModuleProps) {
  const { translateText } = useI18n();
  const canManageBooks = useCanManageAdminSection("books");
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
          canManageBooks
            ? onAddBook ? (
                <Button size="sm" type="button" onClick={onAddBook}>
                  {translateText("Add book")}
                </Button>
              ) : (
                <LinkButton href="/admin/books/new" size="sm">
                  {translateText("Add book")}
                </LinkButton>
              )
            : undefined
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
              {translateText("Clear filters")}
            </Button>
          ) : null
        }
      >
        <BooksTable
          books={books}
          canManage={canManageBooks}
          hasActiveFilters={hasActiveFilters}
          onAddBook={canManageBooks ? onAddBook : undefined}
          onClearFilters={clearFilters}
          onDeleteBook={canManageBooks ? onDeleteBook : undefined}
          onEditBook={canManageBooks ? onEditBook : undefined}
          totalRecords={allRecordsCount}
        />
      </AdminDataTable>
    </div>
  );
}

function AdminBooksLoadingState() {
  const { translateText } = useI18n();

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow={translateText("Catalog")}
        title={translateText("Book management")}
        description={translateText("Loading catalog management surfaces.")}
      />
      <LoadingSkeleton count={1} variant="table" />
      <LoadingSkeleton count={2} variant="card" className="lg:hidden" />
    </div>
  );
}

export { AdminBooksLoadingState, AdminBooksModule };
