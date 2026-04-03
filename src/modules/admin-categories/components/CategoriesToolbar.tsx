import { AdminSearchBar } from "@/components/admin";

interface CategoriesToolbarProps {
  onSearchValueChange: (value: string) => void;
  searchValue: string;
  totalCount: number;
  visibleCount: number;
}

function CategoriesToolbar({
  onSearchValueChange,
  searchValue,
  totalCount,
  visibleCount,
}: Readonly<CategoriesToolbarProps>) {
  return (
    <div className="grid gap-3">
      <AdminSearchBar
        value={searchValue}
        onChange={(event) => onSearchValueChange(event.target.value)}
        label="Search categories"
        placeholder="Search category name or description..."
      />
      <p className="text-body-sm text-text-secondary">
        Showing {visibleCount} of {totalCount} categor{totalCount === 1 ? "y" : "ies"}.
      </p>
    </div>
  );
}

export { CategoriesToolbar, type CategoriesToolbarProps };