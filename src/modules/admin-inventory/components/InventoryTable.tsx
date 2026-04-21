import {
  AdminRowActions,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin";
import { useI18n } from "@/lib/i18n";

import { InventoryConditionBadge } from "./InventoryConditionBadge";
import { InventoryStatusBadge } from "./InventoryStatusBadge";

import type { AdminInventoryRecord } from "../types";

interface InventoryTableProps {
  onEditCopy?: (record: AdminInventoryRecord) => void;
  records: ReadonlyArray<AdminInventoryRecord>;
}

function InventoryTable({
  onEditCopy,
  records,
}: Readonly<InventoryTableProps>) {
  const { translateText } = useI18n();

  return (
    <div className="hidden lg:block">
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>Copy code</AdminTableHead>
            <AdminTableHead>Book</AdminTableHead>
            <AdminTableHead>Condition</AdminTableHead>
            <AdminTableHead>Status</AdminTableHead>
            <AdminTableHead className="text-end">
              {onEditCopy ? "Actions" : "Access"}
            </AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {records.map((record) => (
            <AdminTableRow key={record.id}>
              <AdminTableCell>
                <div className="space-y-1">
                  <p className="text-body text-foreground font-medium">
                    {record.copyCode}
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    {record.updatedAtLabel}
                  </p>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1">
                  <p className="text-body text-foreground font-medium text-balance">
                    {translateText(record.bookTitle)}
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    {translateText(record.bookAuthor)}
                  </p>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <InventoryConditionBadge condition={record.condition} />
              </AdminTableCell>
              <AdminTableCell>
                <InventoryStatusBadge status={record.status} />
              </AdminTableCell>
              <AdminTableCell className="text-end">
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
                  <p className="text-body-sm text-text-tertiary">{translateText("View only")}</p>
                )}
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}

export { InventoryTable, type InventoryTableProps };