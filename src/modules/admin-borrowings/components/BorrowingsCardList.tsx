import {
  AdminUserAvatar,
  AdminSectionCard,
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

interface BorrowingsCardListProps extends AdminBorrowingActionHandlers {
  records: ReadonlyArray<AdminBorrowingRecord>;
}

function BorrowingsCardList({
  onApproveBorrowing,
  onMarkReturned,
  onRejectBorrowing,
  onSendReminder,
  records,
}: Readonly<BorrowingsCardListProps>) {
  return (
    <div className="grid gap-3 lg:hidden">
      {records.map((record) => (
        <AdminSectionCard key={record.id} contentClassName="space-y-4 p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <BookCoverArt
              author={record.bookAuthor}
              className="w-20 shrink-0"
              coverLabel={record.bookCoverLabel}
              title={record.bookTitle}
              tone={record.bookCoverTone}
            />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="space-y-1">
                <p className="text-title-sm text-foreground font-semibold text-balance">
                  {record.bookTitle}
                </p>
                <p className="text-body-sm text-text-secondary">
                  {record.bookAuthor}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <BorrowingStatusBadge
                  label={record.borrowingStatusLabel}
                  tone={record.borrowingStatusTone}
                />
                <FeeBadge
                  label={formatBookFeeLabel(record.feeCents)}
                  tone={getBookFeeTone(record.feeCents)}
                />
              </div>
            </div>
          </div>

          <AdminUserAvatar
            meta={record.branch}
            name={record.memberName}
            size="sm"
            subtitle={record.memberEmail}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Duration
              </p>
              <p className="text-body-sm text-foreground font-medium">
                {record.durationLabel}
              </p>
              {record.isCustomDuration ? (
                <p className="text-caption text-info font-medium uppercase tracking-[0.14em]">
                  Custom request
                </p>
              ) : null}
            </div>
            <div className="space-y-1">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Dates
              </p>
              <p className="text-body-sm text-foreground font-medium">
                {record.timeline.primaryLabel}: {record.timeline.primaryValue}
              </p>
              {record.timeline.secondaryLabel && record.timeline.secondaryValue ? (
                <p className="text-body-sm text-text-secondary">
                  {record.timeline.secondaryLabel}: {record.timeline.secondaryValue}
                </p>
              ) : null}
            </div>
            <div className="space-y-1">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Fee
              </p>
              <FeeBadge
                label={formatBookFeeLabel(record.feeCents)}
                tone={getBookFeeTone(record.feeCents)}
              />
            </div>
            <div className="space-y-1">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Payment
              </p>
              <PaymentStatusBadge
                helperText={record.paymentHelperText}
                label={record.paymentStatusLabel}
                tone={record.paymentStatusTone}
              />
            </div>
          </div>

          <BorrowingActions
            align="end"
            onApproveBorrowing={onApproveBorrowing}
            onMarkReturned={onMarkReturned}
            onRejectBorrowing={onRejectBorrowing}
            onSendReminder={onSendReminder}
            record={record}
          />
        </AdminSectionCard>
      ))}
    </div>
  );
}

export { BorrowingsCardList, type BorrowingsCardListProps };