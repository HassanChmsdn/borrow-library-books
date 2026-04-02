"use client";

import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

import { LoadingSkeleton } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AdminBooksDesktopTable,
  AdminBooksEmptyState,
  AdminBooksMobileList,
} from "./components";
import { useAdminBooksModuleState } from "./hooks";

function AdminBooksModule() {
  const {
    books,
    categories,
    category,
    searchValue,
    setCategory,
    setSearchValue,
    setSortValue,
    setStatus,
    sortOptions,
    sortValue,
    status,
    statusOptions,
  } = useAdminBooksModuleState();

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Catalog"
        title="Book management"
        description="Manage catalog records, borrowing fees, availability, and branch shelf assignments in a layout optimized for dense desktop work and mobile review."
        actions={
          <>
            <Button asChild size="sm" variant="outline">
              <Link href="/books">Open public catalog</Link>
            </Button>
            <Button size="sm" type="button">
              Add book record
            </Button>
          </>
        }
      >
        <div className="rounded-card border-border-subtle bg-card grid gap-4 border p-4 shadow-xs sm:p-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_13rem_13rem]">
            <label className="relative block">
              <span className="sr-only">Search books</span>
              <Search className="text-text-tertiary pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search title, author, or shelf code..."
                className="pl-11"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                State
              </span>
              <select
                className="rounded-input border-input bg-card text-body text-foreground focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring h-11 w-full border px-4 shadow-xs outline-none focus-visible:ring-4"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as typeof status)
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Sort by
              </span>
              <div className="relative">
                <SlidersHorizontal className="text-text-tertiary pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                <select
                  className="rounded-input border-input bg-card text-body text-foreground focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring h-11 w-full border py-2 pr-4 pl-11 shadow-xs outline-none focus-visible:ring-4"
                  value={sortValue}
                  onChange={(event) =>
                    setSortValue(event.target.value as typeof sortValue)
                  }
                >
                  {sortOptions.map((option) => (
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
              {categories.map((item) => {
                const isActive = item === category;

                return (
                  <Button
                    key={item}
                    size="sm"
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </PageHeader>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-title-sm text-foreground font-semibold">
              Catalog records
            </h2>
            <p className="text-body-sm text-text-secondary">
              {books.length} {books.length === 1 ? "record" : "records"} visible
              in the current admin view.
            </p>
          </div>

          {(searchValue.length > 0 ||
            category !== "All" ||
            status !== "all") && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearchValue("");
                setCategory("All");
                setStatus("all");
                setSortValue("updated");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {books.length > 0 ? (
          <>
            <AdminBooksMobileList books={books} />
            <AdminBooksDesktopTable books={books} />
          </>
        ) : (
          <AdminBooksEmptyState />
        )}
      </section>
    </div>
  );
}

function AdminBooksLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Catalog"
        title="Book management"
        description="Loading catalog management surfaces."
      />
      <LoadingSkeleton count={4} variant="card" className="xl:grid-cols-4" />
      <LoadingSkeleton count={2} variant="table" className="xl:grid-cols-2" />
    </div>
  );
}

export { AdminBooksLoadingState, AdminBooksModule };
