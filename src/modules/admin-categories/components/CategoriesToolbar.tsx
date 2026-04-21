import { AdminSearchBar } from "@/components/admin";
import { useI18n } from "@/lib/i18n";

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
  const { formatMessage, translateText } = useI18n();

  return (
    <div className="grid gap-3">
      <AdminSearchBar
        value={searchValue}
        onChange={(event) => onSearchValueChange(event.target.value)}
        label="Search categories"
        placeholder="Search category name or description..."
      />
      <p className="text-body-sm text-text-secondary">
        {formatMessage(translateText("Showing {visibleCount} of {totalCount} {categoryLabel}."), {
          categoryLabel: translateText(totalCount === 1 ? "category" : "categories"),
          totalCount,
          visibleCount,
        })}
      </p>
    </div>
  );
}

export { CategoriesToolbar, type CategoriesToolbarProps };