import {
  AdminFilterSelect,
  AdminSearchBar,
  type AdminFilterOption,
} from "@/components/admin";

import type { AdminBooksCategory } from "../types";

interface BooksToolbarProps {
  categories: ReadonlyArray<AdminBooksCategory>;
  category: AdminBooksCategory;
  onCategoryChange: (value: AdminBooksCategory) => void;
  onSearchValueChange: (value: string) => void;
  searchValue: string;
  totalCount: number;
  visibleCount: number;
}

function BooksToolbar({
  categories,
  category,
  onCategoryChange,
  onSearchValueChange,
  searchValue,
  totalCount,
  visibleCount,
}: BooksToolbarProps) {
  const categoryOptions: ReadonlyArray<AdminFilterOption<AdminBooksCategory>> =
    categories.map((item) => ({
      label: item,
      value: item,
    }));

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <AdminSearchBar
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
          label="Search books"
          placeholder="Search title, author, or shelf code..."
        />
        <AdminFilterSelect
          label="Category"
          options={categoryOptions}
          value={category}
          onValueChange={onCategoryChange}
        />
      </div>
      <p className="text-body-sm text-text-secondary">
        Showing {visibleCount} of {totalCount} catalog
        {totalCount === 1 ? " record" : " records"}.
      </p>
    </div>
  );
}

export { BooksToolbar, type BooksToolbarProps };