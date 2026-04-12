"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { BookOpenText, Search, SlidersHorizontal } from "lucide-react";

import { EmptyState, LoadingSkeleton } from "@/components/feedback";
import { BookCard } from "@/components/library";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  allBooksSortOptions,
  type AllBooksCategory,
  type AllBooksItem,
  type AllBooksSortValue,
} from "./all-books-data";
import { BookCoverArt } from "./book-cover-art";
import {
  formatBookAvailabilityLabel,
  formatBookFeeLabel,
  getBookAvailabilityTone,
  getBookFeeTone,
  getBookStatusLabel,
  getBookStatusTone,
} from "./book-presentation";

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

interface AllBooksModuleProps {
  books: ReadonlyArray<AllBooksItem>;
}

function AllBooksModule({ books }: Readonly<AllBooksModuleProps>) {
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState<AllBooksCategory>("All");
  const [sortValue, setSortValue] = useState<AllBooksSortValue>("featured");
  const allBooksCategories = [
    "All",
    ...new Set(books.map((book) => book.category)),
  ] satisfies ReadonlyArray<AllBooksCategory>;

  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const filteredBooks = sortBooks(
    books.filter((book) => {
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
                action={
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/books/${book.id}`}>Details</Link>
                  </Button>
                }
                author={book.author}
                availabilityLabel={formatBookAvailabilityLabel(book)}
                availabilityTone={getBookAvailabilityTone(book)}
                category={book.category}
                cover={
                  <BookCoverArt
                    author={book.author}
                    coverLabel={book.coverLabel}
                    title={book.title}
                    tone={book.coverTone}
                  />
                }
                feeLabel={formatBookFeeLabel(book.feeCents)}
                feeTone={getBookFeeTone(book.feeCents)}
                statusLabel={getBookStatusLabel(book)}
                statusTone={getBookStatusTone(book)}
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
            description="Try a different title, author, or category filter to bring matching catalog records back into view."
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
