"use client";

import {
  AdminRowActions,
  AdminStatusBadge,
  AdminTableCell,
  AdminTableRow,
} from "@/components/admin";
import { AvailabilityBadge, FeeBadge } from "@/components/library";
import { formatTemplate, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { BookCoverArt } from "@/modules/catalog/book-cover-art";
import {
  formatBookFeeLabel,
  getBookFeeTone,
} from "@/modules/catalog/book-presentation";

import type { AdminBookRecord } from "../types";

interface BookTableRowProps {
  book: AdminBookRecord;
  canManage: boolean;
  onDeleteBook?: (book: AdminBookRecord) => void;
  onEditBook?: (book: AdminBookRecord) => void;
}

function formatCopiesSummary(
  book: AdminBookRecord,
  translateText: (value: string) => string,
) {
  const borrowedCopies = Math.max(book.totalCopies - book.availableCopies, 0);

  return `${book.availableCopies} ${translateText("available")} · ${borrowedCopies} ${translateText("borrowed")}`;
}

function CategoryBadge({
  category,
  className,
}: Readonly<{ category: AdminBookRecord["category"]; className?: string }>) {
  const { translateText } = useI18n();

  return (
    <span
      className={cn(
        "text-caption border-border-subtle bg-muted text-text-secondary inline-flex items-center rounded-pill border px-2.5 py-1 font-medium tracking-[0.08em] whitespace-nowrap uppercase",
        className,
      )}
    >
      {translateText(category)}
    </span>
  );
}

function BookTableRow({
  book,
  canManage,
  onDeleteBook,
  onEditBook,
}: BookTableRowProps) {
  const { translateText } = useI18n();

  return (
    <AdminTableRow>
      <AdminTableCell>
        <div className="flex items-start gap-3.5">
          <BookCoverArt
            author={book.author}
            className="w-14 shrink-0"
            coverLabel={book.coverLabel}
            title={book.title}
            tone={book.coverTone}
          />
          <div className="min-w-0 space-y-1">
            <p className="text-body text-foreground font-medium text-balance">
              {book.title}
            </p>
            <p className="text-body-sm text-text-secondary">{book.author}</p>
            <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
              {book.shelfCode}
            </p>
          </div>
        </div>
      </AdminTableCell>
      <AdminTableCell>
        <CategoryBadge category={book.category} />
      </AdminTableCell>
      <AdminTableCell>
        <FeeBadge
          label={formatBookFeeLabel(book.feeCents)}
          tone={getBookFeeTone(book.feeCents)}
        />
      </AdminTableCell>
      <AdminTableCell>
        <div className="space-y-1">
          <AvailabilityBadge
            label={`${book.availableCopies}/${book.totalCopies} ${translateText("available")}`}
            tone={book.availabilityTone}
          />
          <p className="text-body-sm text-text-secondary">
            {formatCopiesSummary(book, translateText)}
          </p>
        </div>
      </AdminTableCell>
      <AdminTableCell>
        <AdminStatusBadge label={book.statusLabel} tone={book.statusTone} />
      </AdminTableCell>
      <AdminTableCell className="text-end">
        {canManage ? (
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
                  title: formatTemplate(translateText("Delete {title}?"), {
                    title: book.title,
                  }),
                  description:
                    "Delete this catalog title. Books with borrowing history remain protected from destructive removal.",
                  confirmLabel: "Delete book",
                  tone: "danger",
                },
                onAction: onDeleteBook ? () => onDeleteBook(book) : undefined,
              },
            ]}
          />
        ) : (
          <p className="text-body-sm text-text-tertiary">
            {translateText("View only")}
          </p>
        )}
      </AdminTableCell>
    </AdminTableRow>
  );
}

export { BookTableRow, CategoryBadge, type BookTableRowProps };