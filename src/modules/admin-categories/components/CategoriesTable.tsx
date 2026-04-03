import {
  AdminEmptyState,
  AdminRowActions,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { AdminCategoryRecord } from "../types";

interface CategoriesTableProps {
  categories: ReadonlyArray<AdminCategoryRecord>;
  hasActiveFilters: boolean;
  onAddCategory: () => void;
  onClearFilters: () => void;
  onDeleteCategory: (category: AdminCategoryRecord) => void;
  onEditCategory: (category: AdminCategoryRecord) => void;
  totalRecords: number;
}

function CategoryBookCountBadge({ count }: Readonly<{ count: number }>) {
  return (
    <span className="rounded-pill border-border-subtle bg-elevated text-caption text-text-secondary inline-flex items-center border px-2.5 py-1 font-medium whitespace-nowrap">
      {count} {count === 1 ? "book" : "books"}
    </span>
  );
}

function MobileCategoryCard({
  category,
  onDeleteCategory,
  onEditCategory,
}: Readonly<{
  category: AdminCategoryRecord;
  onDeleteCategory: (category: AdminCategoryRecord) => void;
  onEditCategory: (category: AdminCategoryRecord) => void;
}>) {
  return (
    <Card>
      <CardContent className="grid gap-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <p className="text-title-sm text-foreground font-semibold text-balance">
              {category.name}
            </p>
            {category.description ? (
              <p className="text-body-sm text-text-secondary text-pretty">
                {category.description}
              </p>
            ) : (
              <p className="text-body-sm text-text-tertiary">
                No description added yet.
              </p>
            )}
          </div>
          <CategoryBookCountBadge count={category.bookCount} />
        </div>

        <AdminRowActions
          align="end"
          actions={[
            {
              label: "Edit",
              onAction: () => onEditCategory(category),
            },
            {
              label: "Delete",
              onAction: () => onDeleteCategory(category),
              confirm: {
                title: `Delete ${category.name}?`,
                description:
                  "This is still a mock delete flow. Later it can be connected to a real category removal request.",
                confirmLabel: "Delete category",
                tone: "danger",
              },
              variant: "destructive",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}

function CategoriesTable({
  categories,
  hasActiveFilters,
  onAddCategory,
  onClearFilters,
  onDeleteCategory,
  onEditCategory,
  totalRecords,
}: Readonly<CategoriesTableProps>) {
  if (totalRecords === 0) {
    return (
      <AdminEmptyState
        title="No categories yet"
        description="Create the first category to organize public browsing groups and future catalog workflows."
        action={
          <Button size="sm" type="button" onClick={onAddCategory}>
            Add category
          </Button>
        }
      />
    );
  }

  if (categories.length === 0) {
    return (
      <AdminEmptyState
        title="No categories match the current search"
        description="Try a different category name or clear the current search query to see the full management list again."
        action={
          hasActiveFilters ? (
            <Button size="sm" type="button" variant="outline" onClick={onClearFilters}>
              Clear search
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-3 lg:hidden">
        {categories.map((category) => (
          <MobileCategoryCard
            key={category.id}
            category={category}
            onDeleteCategory={onDeleteCategory}
            onEditCategory={onEditCategory}
          />
        ))}
      </div>

      <div className="hidden lg:block">
        <AdminTable>
          <AdminTableHeader>
            <AdminTableRow>
              <AdminTableHead>Category name</AdminTableHead>
              <AdminTableHead>Description</AdminTableHead>
              <AdminTableHead>Book count</AdminTableHead>
              <AdminTableHead className="text-right">Actions</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {categories.map((category) => (
              <AdminTableRow key={category.id}>
                <AdminTableCell>
                  <p className="text-body text-foreground font-medium text-balance">
                    {category.name}
                  </p>
                </AdminTableCell>
                <AdminTableCell>
                  <p className="text-body-sm text-text-secondary max-w-[48ch] text-pretty">
                    {category.description || "No description added yet."}
                  </p>
                </AdminTableCell>
                <AdminTableCell>
                  <CategoryBookCountBadge count={category.bookCount} />
                </AdminTableCell>
                <AdminTableCell className="text-right">
                  <AdminRowActions
                    align="end"
                    actions={[
                      {
                        label: "Edit",
                        onAction: () => onEditCategory(category),
                      },
                      {
                        label: "Delete",
                        onAction: () => onDeleteCategory(category),
                        confirm: {
                          title: `Delete ${category.name}?`,
                          description:
                            "This is still a mock delete flow. Later it can be connected to a real category removal request.",
                          confirmLabel: "Delete category",
                          tone: "danger",
                        },
                        variant: "destructive",
                      },
                    ]}
                  />
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>
    </>
  );
}

export { CategoriesTable, type CategoriesTableProps };