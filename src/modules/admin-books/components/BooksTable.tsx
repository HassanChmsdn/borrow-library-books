import {
  AdminEmptyState,
  AdminRowActions,
  AdminStatusBadge,
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin";
import { AvailabilityBadge, FeeBadge } from "@/components/library";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookCoverArt } from "@/modules/catalog/book-cover-art";
import {
  formatBookFeeLabel,
  getBookFeeTone,
} from "@/modules/catalog/book-presentation";

import { BookTableRow, CategoryBadge } from "./BookTableRow";

import type { AdminBookRecord } from "../types";

interface BooksTableProps {
  books: ReadonlyArray<AdminBookRecord>;
  hasActiveFilters: boolean;
  onAddBook?: () => void;
  onClearFilters?: () => void;
  onDeleteBook?: (book: AdminBookRecord) => void;
  onEditBook?: (book: AdminBookRecord) => void;
  totalRecords: number;
}

function MobileBookCard({
  book,
  onDeleteBook,
  onEditBook,
}: Readonly<{
  book: AdminBookRecord;
  onDeleteBook?: (book: AdminBookRecord) => void;
  onEditBook?: (book: AdminBookRecord) => void;
}>) {
  return (
    <Card>
      <CardContent className="grid gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <BookCoverArt
            author={book.author}
            className="w-20 shrink-0"
            coverLabel={book.coverLabel}
            title={book.title}
            tone={book.coverTone}
          />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="space-y-1">
              <p className="text-title-sm text-foreground font-semibold text-balance">
                {book.title}
              </p>
              <p className="text-body-sm text-text-secondary">{book.author}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={book.category} />
              <FeeBadge
                label={formatBookFeeLabel(book.feeCents)}
                tone={getBookFeeTone(book.feeCents)}
              />
              <AdminStatusBadge label={book.statusLabel} tone={book.statusTone} />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
              Copies
            </p>
            <AvailabilityBadge
              label={`${book.availableCopies}/${book.totalCopies} available`}
              tone={book.availabilityTone}
            />
          </div>
          <div className="space-y-1">
            <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
              Shelf code
            </p>
            <p className="text-body-sm text-text-secondary">{book.shelfCode}</p>
          </div>
        </div>

        <AdminRowActions
          align="end"
          actions={[
            onEditBook
              ? {
                  label: "Edit",
                  variant: "ghost",
                  onAction: () => onEditBook(book),
                }
              : {
                  label: "Edit",
                  variant: "ghost",
                  href: `/admin/books/${book.id}`,
                },
            {
              label: "Delete",
              variant: "ghost",
              confirm: {
                title: `Delete ${book.title}?`,
                description:
                  "This is a mock confirmation flow for future API integration. No backend delete action has been wired yet.",
                confirmLabel: "Delete book",
                tone: "danger",
              },
              onAction: onDeleteBook ? () => onDeleteBook(book) : undefined,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}

function BooksTable({
  books,
  hasActiveFilters,
  onAddBook,
  onClearFilters,
  onDeleteBook,
  onEditBook,
  totalRecords,
}: BooksTableProps) {
  if (totalRecords === 0) {
    return (
      <AdminEmptyState
        title="No books in the catalog yet"
        description="Start the catalog with your first title. New books created here are stored in MongoDB and appear in both admin and public views."
        action={
          <Button type="button" size="sm" onClick={onAddBook}>
            Add book
          </Button>
        }
      />
    );
  }

  if (books.length === 0) {
    return (
      <AdminEmptyState
        title="No books match the current filters"
        description="Adjust the search term or selected category to see more titles in the management table."
        action={
          hasActiveFilters ? (
            <Button type="button" size="sm" variant="outline" onClick={onClearFilters}>
              Clear filters
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-3 lg:hidden">
        {books.map((book) => (
          <MobileBookCard
            key={book.id}
            book={book}
            onDeleteBook={onDeleteBook}
            onEditBook={onEditBook}
          />
        ))}
      </div>

      <div className="hidden lg:block">
        <AdminTable>
          <AdminTableHeader>
            <AdminTableRow>
              <AdminTableHead>Book</AdminTableHead>
              <AdminTableHead>Category</AdminTableHead>
              <AdminTableHead>Fee</AdminTableHead>
              <AdminTableHead>Copies</AdminTableHead>
              <AdminTableHead>Status</AdminTableHead>
              <AdminTableHead className="text-right">Actions</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {books.map((book) => (
              <BookTableRow
                key={book.id}
                book={book}
                onDeleteBook={onDeleteBook}
                onEditBook={onEditBook}
              />
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>
    </>
  );
}

export { BooksTable, type BooksTableProps };