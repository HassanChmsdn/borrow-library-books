"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

import {
  AdminDataTable,
  AdminFilterSelect,
  AdminPageHeader,
  AdminSearchBar,
  AdminTabs,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { Button } from "@/components/ui/button";

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
      <AdminPageHeader
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
        controls={
          <>
            <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_13rem_13rem]">
              <AdminSearchBar
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                label="Search books"
                placeholder="Search title, author, or shelf code..."
              />

              <AdminFilterSelect
                label="State"
                options={statusOptions}
                value={status}
                onValueChange={setStatus}
              />

              <AdminFilterSelect
                label="Sort by"
                options={sortOptions}
                value={sortValue}
                leadingIcon={
                  <SlidersHorizontal aria-hidden="true" className="size-4" />
                }
                onValueChange={setSortValue}
              />
            </div>

            <AdminTabs
              items={categories.map((item) => ({ label: item, value: item }))}
              value={category}
              onValueChange={setCategory}
            />
          </>
        }
      ></AdminPageHeader>

      <AdminDataTable
        title="Catalog records"
        description={`${books.length} ${books.length === 1 ? "record" : "records"} visible in the current admin view.`}
        actions={
          searchValue.length > 0 || category !== "All" || status !== "all" ? (
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
          ) : null
        }
      >
        {books.length > 0 ? (
          <>
            <AdminBooksMobileList books={books} />
            <AdminBooksDesktopTable books={books} />
          </>
        ) : (
          <AdminBooksEmptyState />
        )}
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
      <LoadingSkeleton count={4} variant="card" className="xl:grid-cols-4" />
      <LoadingSkeleton count={2} variant="table" className="xl:grid-cols-2" />
    </div>
  );
}

export { AdminBooksLoadingState, AdminBooksModule };
