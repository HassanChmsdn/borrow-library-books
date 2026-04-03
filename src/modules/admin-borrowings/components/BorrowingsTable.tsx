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
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>Book</AdminTableHead>
            <AdminTableHead>User</AdminTableHead>
            <AdminTableHead>Duration</AdminTableHead>
            <AdminTableHead>Dates</AdminTableHead>
            <AdminTableHead>Fee</AdminTableHead>
            <AdminTableHead>Payment</AdminTableHead>
            <AdminTableHead>Status</AdminTableHead>
            <AdminTableHead className="text-right">Actions</AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {records.map((record) => (
            <AdminTableRow key={record.id}>
              <AdminTableCell>
                <div className="flex items-start gap-3">
                  <BookCoverArt
                    author={record.bookAuthor}
                    className="w-14 shrink-0"
                    coverLabel={record.bookCoverLabel}
                    title={record.bookTitle}
                    tone={record.bookCoverTone}
                  />
                  <div className="min-w-0 space-y-1.5">
                    <p className="text-body text-foreground font-medium text-balance">
                      {record.bookTitle}
                    </p>
                    <p className="text-body-sm text-text-secondary">
                      {record.bookAuthor}
                    </p>
                    <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                      {record.branch}
                    </p>
                  </div>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <AdminUserAvatar
                  meta={record.memberMembership}
                  name={record.memberName}
                  size="sm"
                  subtitle={record.memberEmail}
                />
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1">
                  <p className="text-body-sm text-foreground font-medium">
                    {record.durationLabel}
                  </p>
                  {record.isCustomDuration ? (
                    <p className="text-caption text-info font-medium uppercase tracking-[0.14em]">
                      Custom duration
                    </p>
                  ) : null}
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1">
                  <p className="text-body-sm text-foreground font-medium">
                    {record.timeline.primaryLabel}: {record.timeline.primaryValue}
                  </p>
                  {record.timeline.secondaryLabel && record.timeline.secondaryValue ? (
                    <p className="text-body-sm text-text-secondary">
                      {record.timeline.secondaryLabel}: {record.timeline.secondaryValue}
                    </p>
                  ) : null}
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <FeeBadge
                  label={formatBookFeeLabel(record.feeCents)}
                  tone={getBookFeeTone(record.feeCents)}
                />
              </AdminTableCell>
              <AdminTableCell>
                <PaymentStatusBadge
                  helperText={record.paymentHelperText}
                  label={record.paymentStatusLabel}
                  tone={record.paymentStatusTone}
                />
              </AdminTableCell>
              <AdminTableCell>
                <BorrowingStatusBadge
                  label={record.borrowingStatusLabel}
                  tone={record.borrowingStatusTone}
                />
              </AdminTableCell>
              <AdminTableCell className="text-right">
                <BorrowingActions
                  align="end"
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