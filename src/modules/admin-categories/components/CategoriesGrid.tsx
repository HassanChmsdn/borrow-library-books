import { Button } from "@/components/ui/button";
import { AdminEmptyState } from "@/components/admin";

import type { AdminCategoryRecord } from "../types";
import { CategoryCard } from "./CategoryCard";

interface CategoriesGridProps {
  categories: ReadonlyArray<AdminCategoryRecord>;
  onAddCategory: () => void;
  onDeleteCategory: (category: AdminCategoryRecord) => void;
  onEditCategory: (category: AdminCategoryRecord) => void;
  onResetSearch?: () => void;
  searchQuery?: string;
}

function CategoriesGrid({
  categories,
  onAddCategory,
  onDeleteCategory,
  onEditCategory,
  onResetSearch,
  searchQuery,
}: CategoriesGridProps) {
  if (categories.length === 0 && searchQuery?.trim()) {
    return (
      <AdminEmptyState
        title="No categories match this search"
        description="Later search or filter controls can reuse this state when a query removes every category from the current result set."
        action={
          onResetSearch ? (
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={onResetSearch}
            >
              Clear search
            </Button>
          ) : null
        }
      />
    );
  }

  if (categories.length === 0) {
    return (
      <AdminEmptyState
        title="No categories yet"
        description="Create the first category to start organizing book groups for browse filters, admin planning, and future catalog workflows."
        action={
          <Button size="sm" type="button" onClick={onAddCategory}>
            Add category
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onDeleteCategory={onDeleteCategory}
          onEditCategory={onEditCategory}
        />
      ))}
    </div>
  );
}

export { CategoriesGrid, type CategoriesGridProps };
