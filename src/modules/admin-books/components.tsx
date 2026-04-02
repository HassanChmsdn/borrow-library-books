import Link from "next/link";

import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  KpiCard,
} from "@/components/admin";
import { EmptyState } from "@/components/feedback";
import {
  AvailabilityBadge,
  BorrowStatusBadge,
  FeeBadge,
} from "@/components/library";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookCoverArt } from "@/modules/catalog/book-cover-art";
import {
  formatBookFeeLabel,
  getBookFeeTone,
} from "@/modules/catalog/book-presentation";

import type { AdminBookRecord, AdminBooksMetric } from "./types";

function formatAdminBookAvailabilityLabel(book: AdminBookRecord) {
  return `${book.availableCopies}/${book.totalCopies} available`;
}

function AdminBooksMetricGrid({
  metrics,
}: Readonly<{ metrics: ReadonlyArray<AdminBooksMetric> }>) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <KpiCard
            key={metric.label}
            icon={<Icon aria-hidden="true" className="size-4" />}
            label={metric.label}
            supportingText={metric.supportingText}
            value={metric.value}
          />
        );
      })}
    </div>
  );
}

function AdminBooksMobileList({
  books,
}: Readonly<{ books: ReadonlyArray<AdminBookRecord> }>) {
  return (
    <div className="grid gap-3 lg:hidden">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden">
          <CardContent className="grid gap-4 p-4 sm:p-5">
            <div className="flex items-start gap-4">
              <BookCoverArt
                author={book.author}
                className="w-24 shrink-0"
                coverLabel={book.coverLabel}
                title={book.title}
                tone={book.coverTone}
              />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <BorrowStatusBadge
                    label={book.workflowLabel}
                    tone={book.workflowTone}
                  />
                  <FeeBadge
                    label={formatBookFeeLabel(book.feeCents)}
                    tone={getBookFeeTone(book.feeCents)}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-title-sm text-foreground font-semibold text-balance">
                    {book.title}
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    {book.author}
                  </p>
                  <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                    {book.category} · {book.shelfCode}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-dashed border-black/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-body-sm text-text-secondary">
                  Availability
                </span>
                <AvailabilityBadge
                  label={formatAdminBookAvailabilityLabel(book)}
                  tone={book.availabilityTone}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-body-sm text-text-secondary">Branch</span>
                <span className="text-body-sm text-foreground font-medium">
                  {book.branch}
                </span>
              </div>
              <p className="text-body-sm text-text-secondary">
                {book.lastUpdated}
              </p>
            </div>

            <div className="flex justify-end">
              <Button asChild size="sm" variant="outline">
                <Link href={`/books/${book.id}`}>View public details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminBooksDesktopTable({
  books,
}: Readonly<{ books: ReadonlyArray<AdminBookRecord> }>) {
  return (
    <div className="hidden lg:block">
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>Book</AdminTableHead>
            <AdminTableHead>Availability</AdminTableHead>
            <AdminTableHead>Fee</AdminTableHead>
            <AdminTableHead>Branch</AdminTableHead>
            <AdminTableHead>Updated</AdminTableHead>
            <AdminTableHead className="text-right">Action</AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {books.map((book) => (
            <AdminTableRow key={book.id}>
              <AdminTableCell>
                <div className="flex items-start gap-4">
                  <BookCoverArt
                    author={book.author}
                    className="w-16 shrink-0"
                    coverLabel={book.coverLabel}
                    title={book.title}
                    tone={book.coverTone}
                  />
                  <div className="space-y-1.5">
                    <p className="text-body text-foreground font-medium">
                      {book.title}
                    </p>
                    <p className="text-body-sm text-text-secondary">
                      {book.author}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                        {book.category} · {book.shelfCode}
                      </p>
                      <BorrowStatusBadge
                        label={book.workflowLabel}
                        tone={book.workflowTone}
                      />
                    </div>
                  </div>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <AvailabilityBadge
                  label={formatAdminBookAvailabilityLabel(book)}
                  tone={book.availabilityTone}
                />
              </AdminTableCell>
              <AdminTableCell>
                <FeeBadge
                  label={formatBookFeeLabel(book.feeCents)}
                  tone={getBookFeeTone(book.feeCents)}
                />
              </AdminTableCell>
              <AdminTableCell className="text-body-sm text-text-secondary">
                {book.branch}
              </AdminTableCell>
              <AdminTableCell className="text-body-sm text-text-secondary">
                {book.lastUpdated}
              </AdminTableCell>
              <AdminTableCell className="text-right">
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/books/${book.id}`}>Preview</Link>
                </Button>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}

function AdminBooksEmptyState() {
  return (
    <EmptyState
      title="No books match the current filters"
      description="Adjust the search term, category, or state filter. This admin catalog remains powered by local mock data for now."
      size="sm"
    />
  );
}

export {
  AdminBooksDesktopTable,
  AdminBooksEmptyState,
  AdminBooksMetricGrid,
  AdminBooksMobileList,
};
