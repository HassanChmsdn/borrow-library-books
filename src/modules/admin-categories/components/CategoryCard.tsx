import {
  BookOpenText,
  BrainCircuit,
  BriefcaseBusiness,
  Landmark,
  MonitorCog,
  Orbit,
  Palette,
  Plane,
  type LucideIcon,
} from "lucide-react";

import { AdminRowActions } from "@/components/admin";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { AdminCategoryMarkerTone, AdminCategoryRecord } from "../types";

interface CategoryCardProps {
  category: AdminCategoryRecord;
  onDeleteCategory: (category: AdminCategoryRecord) => void;
  onEditCategory: (category: AdminCategoryRecord) => void;
}

const categoryIconMap: Record<AdminCategoryRecord["iconKey"], LucideIcon> = {
  "art-design": Palette,
  business: BriefcaseBusiness,
  fiction: BookOpenText,
  history: Landmark,
  philosophy: Orbit,
  science: BrainCircuit,
  technology: MonitorCog,
  travel: Plane,
};

const markerToneClassNames: Record<AdminCategoryMarkerTone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  danger: "bg-danger-surface text-danger ring-danger-border/60",
  info: "bg-info-surface text-info ring-info-border/60",
  neutral: "bg-elevated text-foreground ring-black/8",
  success: "bg-success-surface text-success ring-success-border/60",
  warning: "bg-warning-surface text-warning ring-warning-border/60",
};

function CategoryBookCountBadge({ count }: Readonly<{ count: number }>) {
  return (
    <span className="rounded-pill border-border-subtle bg-elevated text-caption text-text-secondary inline-flex items-center border px-2.5 py-1 font-medium whitespace-nowrap">
      {count} {count === 1 ? "book" : "books"}
    </span>
  );
}

function CategoryCard({
  category,
  onDeleteCategory,
  onEditCategory,
}: CategoryCardProps) {
  const Icon = categoryIconMap[category.iconKey];

  return (
    <Card className="h-full">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset",
              markerToneClassNames[category.markerTone],
            )}
          >
            <Icon aria-hidden="true" className="size-5" />
          </div>
          <CategoryBookCountBadge count={category.bookCount} />
        </div>

        <div className="space-y-2">
          <h2 className="text-title-sm text-foreground font-semibold">
            {category.name}
          </h2>
          <p className="text-body-sm text-text-secondary max-w-[34ch] text-pretty">
            {category.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <p className="text-caption text-text-tertiary">
          Prepared for future CRUD integration through typed mock data and
          reusable admin interactions.
        </p>
      </CardContent>

      <CardFooter className="mt-auto justify-between border-t border-black/5 pt-4">
        <AdminRowActions
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
                  "This is a mock delete action for now. Later it can be connected to a real category removal flow.",
                confirmLabel: "Delete category",
                tone: "danger",
              },
              variant: "destructive",
            },
          ]}
          align="end"
        />
      </CardFooter>
    </Card>
  );
}

export { CategoryCard, type CategoryCardProps };
