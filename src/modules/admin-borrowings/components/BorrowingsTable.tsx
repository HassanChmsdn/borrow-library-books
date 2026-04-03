import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  AdminUserAvatar,
} from "@/components/admin";
import { FeeBadge } from "@/components/library";
import { BookCoverArt } from "@/modules/catalog/book-cover-art";
import {
  formatBookFeeLabel,
  getBookFeeTone,
} from "@/modules/catalog/book-presentation";

import { BorrowingActions } from "./BorrowingActions";
import { BorrowingStatusBadge } from "./BorrowingStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

import type {
  AdminBorrowingActionHandlers,
  AdminBorrowingRecord,
} from "../types";

interface BorrowingsTableProps extends AdminBorrowingActionHandlers {
  records: ReadonlyArray<AdminBorrowingRecord>;
}

function BorrowingsTable({
  onApproveBorrowing,
  onMarkReturned,
  onRejectBorrowing,
  onSendReminder,
  records,
}: Readonly<BorrowingsTableProps>) {
  return (
    <div className="hidden lg:block">
      <AdminTable className="min-w-0 table-fixed">
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead className="w-[23%]">Book</AdminTableHead>
            <AdminTableHead className="w-[18%]">User</AdminTableHead>
            <AdminTableHead className="w-[19%]">Duration and dates</AdminTableHead>
            <AdminTableHead className="w-[18%]">Fee and payment</AdminTableHead>
            <AdminTableHead className="w-[10%] whitespace-nowrap">Status</AdminTableHead>
            <AdminTableHead className="w-[12%] whitespace-nowrap text-right">Actions</AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {records.map((record) => (
            <AdminTableRow key={record.id}>
              <AdminTableCell>
                <div className="flex items-start gap-3">
                  <BookCoverArt
                    author={record.bookAuthor}
                    className="w-11 shrink-0 rounded-xl"
                    coverLabel={record.bookCoverLabel}
                    title={record.bookTitle}
                    tone={record.bookCoverTone}
                  />
                  <div className="min-w-0 space-y-1">
                    <p
                      className="text-body-sm text-foreground truncate font-medium"
                      title={record.bookTitle}
                    >
                      {record.bookTitle}
                    </p>
                    <p
                      className="text-body-sm text-text-secondary truncate"
                      title={record.bookAuthor}
                    >
                      {record.bookAuthor}
                    </p>
                  </div>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <AdminUserAvatar
                  className="gap-2.5"
                  meta={record.memberMembership}
                  name={record.memberName}
                  size="sm"
                  subtitle={
                    <span className="block truncate" title={record.memberEmail}>
                      {record.memberEmail}
                    </span>
                  }
                />
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1.5">
                  <p className="text-body-sm text-foreground font-medium">
                    {record.durationLabel}
                  </p>
                  {record.isCustomDuration ? (
                    <p className="text-caption text-info font-medium uppercase tracking-[0.14em]">
                      Custom duration
                    </p>
                  ) : null}
                  <div className="space-y-0.5">
                    <p className="text-caption text-text-secondary">
                      <span className="font-medium uppercase tracking-[0.14em]">
                        {record.timeline.primaryLabel}
                      </span>{" "}
                      {record.timeline.primaryValue}
                    </p>
                  {record.timeline.secondaryLabel && record.timeline.secondaryValue ? (
                    <p className="text-caption text-text-tertiary">
                      <span className="font-medium uppercase tracking-[0.14em]">
                        {record.timeline.secondaryLabel}
                      </span>{" "}
                      {record.timeline.secondaryValue}
                    </p>
                  ) : null}
                  </div>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1.5">
                  <FeeBadge
                    className="max-w-full"
                    label={formatBookFeeLabel(record.feeCents)}
                    tone={getBookFeeTone(record.feeCents)}
                  />
                  <PaymentStatusBadge
                    compact
                    helperText={record.paymentHelperText}
                    label={record.paymentStatusLabel}
                    tone={record.paymentStatusTone}
                  />
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <BorrowingStatusBadge
                  density="compact"
                  label={record.borrowingStatusLabel}
                  tone={record.borrowingStatusTone}
                />
              </AdminTableCell>
              <AdminTableCell className="text-right">
                <BorrowingActions
                  align="end"
                  density="table"
                  onApproveBorrowing={onApproveBorrowing}
                  onMarkReturned={onMarkReturned}
                  onRejectBorrowing={onRejectBorrowing}
                  onSendReminder={onSendReminder}
                  record={record}
                />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}

export { BorrowingsTable, type BorrowingsTableProps };