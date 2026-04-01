"use client";

import { useDeferredValue, useState } from "react";
import { BookOpenText, Search, SlidersHorizontal } from "lucide-react";

import { EmptyState, LoadingSkeleton } from "@/components/feedback";
import {
  BookCard,
  type AvailabilityBadgeTone,
  type BookCardStatusTone,
  type FeeBadgeTone,
} from "@/components/library";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  allBooksCatalog,
  allBooksCategories,
  allBooksSortOptions,
  type AllBooksCategory,
  type AllBooksItem,
  type AllBooksSortValue,
  type BookCoverTone,
} from "./all-books-data";

const coverToneClasses: Record<
  BookCoverTone,
  { accent: string; body: string; text: string; meta: string }
> = {
  amber: {
    accent: "bg-brand-500",
    body: "bg-brand-100",
    text: "text-brand-900",
    meta: "text-brand-800/80",
  },
  brand: {
    accent: "bg-brand-700",
    body: "bg-brand-200",
    text: "text-brand-900",
    meta: "text-brand-800/80",
  },
  forest: {
    accent: "bg-success",
    body: "bg-success-surface",
    text: "text-success",
    meta: "text-success/80",
  },
  ocean: {
    accent: "bg-info",
    body: "bg-info-surface",
    text: "text-info",
    meta: "text-info/80",
  },
  rose: {
    accent: "bg-danger",
    body: "bg-danger-surface",
    text: "text-danger",
    meta: "text-danger/80",
  },
  stone: {
    accent: "bg-stone-700",
    body: "bg-stone-100",
    text: "text-stone-900",
    meta: "text-stone-700/80",
  },
};

function formatFeeLabel(feeCents: number) {
  if (feeCents === 0) {
    return "Free";
  }

  return `$${(feeCents / 100).toFixed(2)} cash`;
}

function getFeeTone(feeCents: number): FeeBadgeTone {
  return feeCents === 0 ? "free" : "paid";
}

function getAvailabilityTone(book: AllBooksItem): AvailabilityBadgeTone {
  if (book.availableCopies === 0) {
    return "unavailable";
  }

  if (book.availableCopies / book.totalCopies <= 0.34) {
    return "limited";
  }

  return "available";
}

function getStatusLabel(book: AllBooksItem) {
  if (book.feeCents === 0) {
    return "Free pick";
  }

  if (book.availableCopies === 0) {
    return "Waitlist";
  }

  if (book.availableCopies === 1) {
    return "Low stock";
  }

  return "Available";
}

function getStatusTone(book: AllBooksItem): BookCardStatusTone {
  if (book.availableCopies === 0) {
    return "danger";
  }

  if (book.availableCopies === 1) {
    return "warning";
  }

  return book.feeCents === 0 ? "success" : "info";
}

function formatAvailabilityLabel(book: AllBooksItem) {
  return `${book.availableCopies}/${book.totalCopies} available`;
}

function sortBooks(
  books: ReadonlyArray<AllBooksItem>,
  sortValue: AllBooksSortValue,
) {
  const nextBooks = [...books];

  if (sortValue === "author") {
    nextBooks.sort((left, right) => left.author.localeCompare(right.author));
    return nextBooks;
  }

  if (sortValue === "availability") {
    nextBooks.sort(
      (left, right) => right.availableCopies - left.availableCopies,
    );
    return nextBooks;
  }

  if (sortValue === "fee") {
    nextBooks.sort((left, right) => left.feeCents - right.feeCents);
    return nextBooks;
  }

  if (sortValue === "title") {
    nextBooks.sort((left, right) => left.title.localeCompare(right.title));
    return nextBooks;
  }

  return nextBooks;
}

function BookCover({
  author,
  coverLabel,
  title,
  tone,
}: {
  author: string;
  coverLabel: string;
  title: string;
  tone: BookCoverTone;
}) {
  const coverTone = coverToneClasses[tone];

  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden rounded-2xl border border-black/5 p-4 shadow-xs",
        coverTone.body,
      )}
    >
      <div className={cn("absolute inset-y-0 left-0 w-3", coverTone.accent)} />
      <div className="flex h-full flex-col justify-between pl-4">
        <p
          className={cn(
            "text-caption font-medium tracking-[0.18em] uppercase",
            coverTone.meta,
          )}
        >
          {coverLabel}
        </p>
        <div className="space-y-2">
          <h3
            className={cn(
              "text-base leading-snug font-semibold text-balance",
              coverTone.text,
            )}
          >
            {title}
          </h3>
          <p className={cn("text-caption", coverTone.meta)}>{author}</p>
        </div>
      </div>
    </div>
  );
}

function AllBooksModule() {
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState<AllBooksCategory>("All");
  const [sortValue, setSortValue] = useState<AllBooksSortValue>("featured");

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const filteredBooks = sortBooks(
    allBooksCatalog.filter((book) => {
      const matchesCategory =
        activeCategory === "All" || book.category === activeCategory;
      const matchesSearch =
        normalizedSearchValue.length === 0 ||
        book.title.toLowerCase().includes(normalizedSearchValue) ||
        book.author.toLowerCase().includes(normalizedSearchValue);

      return matchesCategory && matchesSearch;
    }),
    sortValue,
  );

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Catalog"
        title="All Books"
        description="Discover and borrow from the full library catalog. Search, refine, and scan availability at a glance with the same mobile-first spacing and tokens used throughout the shell."
      >
        <div className="rounded-card border-border-subtle bg-card grid gap-4 border p-4 shadow-xs sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
            <label className="relative block">
              <span className="sr-only">Search books by title or author</span>
              <Search className="text-text-tertiary pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <Input
                aria-label="Search books by title or author"
                className="pl-11"
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by title or author..."
                value={searchValue}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Sort by
              </span>
              <div className="relative">
                <SlidersHorizontal className="text-text-tertiary pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                <select
                  aria-label="Sort all books"
                  className="rounded-input border-input bg-card text-body text-foreground focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring flex h-11 w-full appearance-none border py-2 pr-10 pl-11 shadow-xs transition-[border-color,box-shadow,background-color,color] duration-200 outline-none focus-visible:ring-4"
                  onChange={(event) =>
                    setSortValue(event.target.value as AllBooksSortValue)
                  }
                  value={sortValue}
                >
                  {allBooksSortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2">
              {allBooksCategories.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <Button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    size="sm"
                    type="button"
                    variant={isActive ? "default" : "outline"}
                  >
                    {category}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </PageHeader>

      <section aria-labelledby="all-books-grid-title" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2
              id="all-books-grid-title"
              className="text-title-sm text-foreground font-semibold"
            >
              Collection
            </h2>
            <p className="text-body-sm text-text-secondary">
              {filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "book" : "books"} found
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}.
            </p>
          </div>

          {(activeCategory !== "All" || searchValue.length > 0) && (
            <Button
              onClick={() => {
                setActiveCategory("All");
                setSearchValue("");
                setSortValue("featured");
              }}
              size="sm"
              type="button"
              variant="ghost"
            >
              Clear filters
            </Button>
          )}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                author={book.author}
                availabilityLabel={formatAvailabilityLabel(book)}
                availabilityTone={getAvailabilityTone(book)}
                category={book.category}
                cover={
                  <BookCover
                    author={book.author}
                    coverLabel={book.coverLabel}
                    title={book.title}
                    tone={book.coverTone}
                  />
                }
                feeLabel={formatFeeLabel(book.feeCents)}
                feeTone={getFeeTone(book.feeCents)}
                statusLabel={getStatusLabel(book)}
                statusTone={getStatusTone(book)}
                title={book.title}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            action={
              <Button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchValue("");
                  setSortValue("featured");
                }}
                type="button"
              >
                Reset catalog filters
              </Button>
            }
            description="Try a different title, author, or category filter. The catalog is still powered by local mock data, so this state is safe to iterate on without backend wiring."
            icon={<BookOpenText className="size-5" />}
            title="No books match your filters"
          />
        )}
      </section>
    </div>
  );
}

function AllBooksLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Catalog"
        title="All Books"
        description="Discover and borrow from the full library catalog."
      >
        <div className="rounded-card border-border-subtle bg-card grid gap-4 border p-4 shadow-xs sm:p-5">
          <LoadingSkeleton
            className="sm:grid-cols-2"
            count={2}
            variant="table"
          />
        </div>
      </PageHeader>

      <section aria-labelledby="all-books-loading-title" className="space-y-4">
        <div className="space-y-1">
          <h2
            id="all-books-loading-title"
            className="text-title-sm text-foreground font-semibold"
          >
            Collection
          </h2>
          <p className="text-body-sm text-text-secondary">
            Preparing catalog cards and filters.
          </p>
        </div>
        <LoadingSkeleton
          className="sm:grid-cols-2 xl:grid-cols-3"
          count={6}
          variant="card"
        />
      </section>
    </div>
  );
}

export { AllBooksLoadingState, AllBooksModule };
