import { AdminRowActions, AdminSectionCard } from "@/components/admin";

import { InventoryConditionBadge } from "./InventoryConditionBadge";
import { InventoryStatusBadge } from "./InventoryStatusBadge";

import type { AdminInventoryRecord } from "../types";

interface InventoryCardListProps {
  onEditCopy?: (record: AdminInventoryRecord) => void;
  records: ReadonlyArray<AdminInventoryRecord>;
}

function InventoryCardList({
  onEditCopy,
  records,
}: Readonly<InventoryCardListProps>) {
  return (
    <div className="grid gap-3 lg:hidden">
      {records.map((record) => (
        <AdminSectionCard key={record.id} contentClassName="space-y-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <p className="text-title-sm text-foreground font-semibold">
                {record.copyCode}
              </p>
              <p className="text-body-sm text-text-secondary">
                {record.updatedAtLabel}
              </p>
            </div>
            <InventoryStatusBadge status={record.status} />
          </div>

          <div className="space-y-1">
            <p className="text-body text-foreground font-medium text-balance">
              {record.bookTitle}
            </p>
            <p className="text-body-sm text-text-secondary">
              {record.bookAuthor}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
              Condition
            </p>
            <InventoryConditionBadge condition={record.condition} />
          </div>

          {onEditCopy ? (
            <AdminRowActions
              align="end"
              actions={[
                {
                  label: "Edit",
                  onAction: () => onEditCopy(record),
                  variant: "outline",
                },
              ]}
            />
          ) : (
            <p className="text-body-sm text-text-tertiary text-right">View only</p>
          )}
        </AdminSectionCard>
      ))}
    </div>
  );
}

export { InventoryCardList, type InventoryCardListProps };