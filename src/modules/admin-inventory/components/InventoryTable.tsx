import {
  AdminRowActions,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin";

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
  return (
    <div className="hidden lg:block">
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>Copy code</AdminTableHead>
            <AdminTableHead>Book</AdminTableHead>
            <AdminTableHead>Location</AdminTableHead>
            <AdminTableHead>Condition</AdminTableHead>
            <AdminTableHead>Status</AdminTableHead>
            <AdminTableHead className="text-right">Actions</AdminTableHead>
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
                    {record.bookTitle}
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    {record.bookAuthor}
                  </p>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1">
                  <p className="text-body-sm text-foreground font-medium">
                    {record.location}
                  </p>
                  {record.locationNote ? (
                    <p className="text-body-sm text-text-secondary">
                      {record.locationNote}
                    </p>
                  ) : null}
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <InventoryConditionBadge condition={record.condition} />
              </AdminTableCell>
              <AdminTableCell>
                <InventoryStatusBadge status={record.status} />
              </AdminTableCell>
              <AdminTableCell className="text-right">
                <AdminRowActions
                  align="end"
                  actions={[
                    {
                      label: "Edit",
                      onAction: onEditCopy
                        ? () => onEditCopy(record)
                        : undefined,
                      variant: "outline",
                    },
                  ]}
                />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}

export { InventoryTable, type InventoryTableProps };