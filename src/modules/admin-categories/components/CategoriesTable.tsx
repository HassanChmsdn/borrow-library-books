"use client";

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
import { formatTemplate, useI18n } from "@/lib/i18n";

import type { AdminCategoryRecord } from "../types";

interface CategoriesTableProps {
  categories: ReadonlyArray<AdminCategoryRecord>;
  canManage: boolean;
  hasActiveFilters: boolean;
  onAddCategory?: () => void;
  onClearFilters: () => void;
  onDeleteCategory?: (category: AdminCategoryRecord) => void;
  onEditCategory?: (category: AdminCategoryRecord) => void;
  totalRecords: number;
}

function CategoryBookCountBadge({ count }: Readonly<{ count: number }>) {
  const { translateText } = useI18n();

  return (
    <span className="rounded-pill border-border-subtle bg-elevated text-caption text-text-secondary inline-flex items-center border px-2.5 py-1 font-medium whitespace-nowrap">
      {count} {translateText(count === 1 ? "book" : "books")}
    </span>
  );
}

function MobileCategoryCard({
  category,
  canManage,
  onDeleteCategory,
  onEditCategory,
}: Readonly<{
  category: AdminCategoryRecord;
  canManage: boolean;
  onDeleteCategory?: (category: AdminCategoryRecord) => void;
  onEditCategory?: (category: AdminCategoryRecord) => void;
}>) {
  const { translateText } = useI18n();

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
                {translateText("No description added yet.")}
              </p>
            )}
          </div>
          <CategoryBookCountBadge count={category.bookCount} />
        </div>

        {canManage ? (
          <AdminRowActions
            align="end"
            actions={[
              {
                label: "Edit",
                onAction: onEditCategory ? () => onEditCategory(category) : undefined,
              },
              {
                label: "Delete",
                onAction: onDeleteCategory ? () => onDeleteCategory(category) : undefined,
                confirm: {
                  title: formatTemplate(translateText("Delete {title}?"), {
                    title: category.name,
                  }),
                  description:
                    "This is still a mock delete flow. Later it can be connected to a real category removal request.",
                  confirmLabel: "Delete category",
                  tone: "danger",
                },
                variant: "destructive",
              },
            ]}
          />
        ) : (
          <p className="text-body-sm text-text-tertiary text-end">
            {translateText("View only")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function CategoriesTable({
  categories,
  canManage,
  hasActiveFilters,
  onAddCategory,
  onClearFilters,
  onDeleteCategory,
  onEditCategory,
  totalRecords,
}: Readonly<CategoriesTableProps>) {
  const { translateText } = useI18n();

  if (totalRecords === 0) {
    return (
      <AdminEmptyState
        title="No categories yet"
        description="Create the first category to organize public browsing groups and future catalog workflows."
        action={
          canManage ? (
            <Button size="sm" type="button" onClick={onAddCategory}>
              {translateText("Add category")}
            </Button>
          ) : null
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
              {translateText("Clear search")}
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
            canManage={canManage}
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
              <AdminTableHead>{translateText("Book count")}</AdminTableHead>
              <AdminTableHead className="text-end">
                {canManage ? "Actions" : "Access"}
              </AdminTableHead>
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
                    {category.description || translateText("No description added yet.")}
                  </p>
                </AdminTableCell>
                <AdminTableCell>
                  <CategoryBookCountBadge count={category.bookCount} />
                </AdminTableCell>
                <AdminTableCell className="text-end">
                  {canManage ? (
                    <AdminRowActions
                      align="end"
                      actions={[
                        {
                          label: "Edit",
                          onAction: onEditCategory ? () => onEditCategory(category) : undefined,
                        },
                        {
                          label: "Delete",
                          onAction: onDeleteCategory ? () => onDeleteCategory(category) : undefined,
                          confirm: {
                            title: formatTemplate(translateText("Delete {title}?"), {
                              title: category.name,
                            }),
                            description:
                              "This is still a mock delete flow. Later it can be connected to a real category removal request.",
                            confirmLabel: "Delete category",
                            tone: "danger",
                          },
                          variant: "destructive",
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
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>
    </>
  );
}

export { CategoriesTable, type CategoriesTableProps };