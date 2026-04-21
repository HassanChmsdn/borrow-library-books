"use client";

import {
  AdminEmptyState,
  AdminSectionCard,
  AdminStatusBadge,
} from "@/components/admin";
import { FeeBadge } from "@/components/library";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { translateAdminUserText } from "../i18n";

import type {
  AdminUserBorrowingRecord,
  AdminUserBorrowingStatus,
  AdminUserPaymentStatus,
} from "../types";

interface UserBorrowingHistoryProps {
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  records: ReadonlyArray<AdminUserBorrowingRecord>;
  title: string;
}

function getBorrowingTone(
  status: AdminUserBorrowingStatus,
): "danger" | "info" | "neutral" | "success" | "warning" {
  switch (status) {
    case "active":
      return "info";
    case "overdue":
      return "danger";
    case "pending":
      return "warning";
    default:
      return "neutral";
  }
}

function getBorrowingLabel(status: AdminUserBorrowingStatus) {
  switch (status) {
    case "active":
      return "Active";
    case "overdue":
      return "Overdue";
    case "pending":
      return "Pending";
    default:
      return "Returned";
  }
}

function getPaymentConfig(status: AdminUserPaymentStatus) {
  switch (status) {
    case "cash-due":
      return { label: "Cash due onsite", tone: "warning" as const };
    case "cash-settled":
      return { label: "Cash settled", tone: "success" as const };
    default:
      return { label: "No fee", tone: "neutral" as const };
  }
}

function getFeeTone(record: AdminUserBorrowingRecord) {
  return record.paymentStatus === "not-required" ? "free" : "paid";
}

function UserBorrowingHistory({
  description,
  emptyDescription,
  emptyTitle,
  records,
  title,
}: Readonly<UserBorrowingHistoryProps>) {
  const { translateText } = useI18n();

  return (
    <AdminSectionCard title={title} description={description}>
      {records.length === 0 ? (
        <AdminEmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <div className="grid gap-3 2xl:hidden">
            {records.map((record) => {
              const paymentConfig = getPaymentConfig(record.paymentStatus);

              return (
                <div
                  key={record.id}
                  className="rounded-card border-border-subtle bg-elevated grid gap-3 border p-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="text-body text-foreground font-semibold">
                          {translateText(record.bookTitle)}
                        </p>
                        <p className="text-body-sm text-text-secondary">
                          {translateText(record.bookAuthor)}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <AdminStatusBadge
                          label={translateText(getBorrowingLabel(record.status))}
                          tone={getBorrowingTone(record.status)}
                        />
                        {record.customDurationRequested ? (
                          <AdminStatusBadge label={translateText("Custom duration")} tone="warning" />
                        ) : null}
                      </div>
                    </div>
                    {record.note ? (
                      <p className="text-body-sm text-text-secondary">
                        {translateText(record.note)}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                          {translateText("Duration")}
                      </p>
                      <p className="text-body-sm text-foreground font-medium">
                        {translateAdminUserText(record.durationLabel, translateText)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                          {translateText("Dates")}
                      </p>
                      <p className="text-body-sm text-foreground font-medium">
                        {translateAdminUserText(record.startedDateLabel, translateText)}
                      </p>
                      <p className="text-body-sm text-text-secondary">
                        {record.completedDateLabel
                          ? translateAdminUserText(record.completedDateLabel, translateText)
                          : record.dueDateLabel
                            ? translateAdminUserText(record.dueDateLabel, translateText)
                            : translateText("No date recorded")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                        {translateText("Fee")}
                      </p>
                      <FeeBadge label={translateAdminUserText(record.feeLabel, translateText)} tone={getFeeTone(record)} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                        {translateText("Payment")}
                      </p>
                      <AdminStatusBadge
                        label={translateText(paymentConfig.label)}
                        tone={paymentConfig.tone}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden 2xl:block overflow-hidden rounded-card border border-black/5">
            <div className="overflow-x-auto">
              <div className="min-w-232">
                <div className="bg-elevated text-text-tertiary grid grid-cols-[minmax(0,2fr)_minmax(8rem,0.85fr)_minmax(11rem,1.05fr)_minmax(10rem,0.95fr)_minmax(8rem,0.8fr)] gap-4 px-4 py-3 text-[0.6875rem] leading-4 font-medium tracking-[0.16em] uppercase">
                  <span>{translateText("Book")}</span>
                  <span>{translateText("Duration")}</span>
                  <span>{translateText("Dates")}</span>
                  <span>{translateText("Fee")}</span>
                  <span>{translateText("Status")}</span>
                </div>
                {records.map((record, index) => {
                  const paymentConfig = getPaymentConfig(record.paymentStatus);

                  return (
                    <div
                      key={record.id}
                      className={cn(
                        "grid grid-cols-[minmax(0,2fr)_minmax(8rem,0.85fr)_minmax(11rem,1.05fr)_minmax(10rem,0.95fr)_minmax(8rem,0.8fr)] gap-4 px-4 py-4",
                        index !== records.length - 1 ? "border-b border-black/5" : null,
                      )}
                    >
                      <div className="min-w-0 space-y-1.5">
                        <p className="text-body-sm text-foreground font-semibold">
                          {translateText(record.bookTitle)}
                        </p>
                        <p className="text-body-sm text-text-secondary">
                          {translateText(record.bookAuthor)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {record.customDurationRequested ? (
                            <AdminStatusBadge label={translateText("Custom duration")} tone="warning" />
                          ) : null}
                          {record.note ? (
                            <p className="text-caption text-text-tertiary">{translateText(record.note)}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-body-sm text-foreground font-medium">
                          {translateAdminUserText(record.durationLabel, translateText)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-body-sm text-foreground font-medium">
                          {translateAdminUserText(record.startedDateLabel, translateText)}
                        </p>
                        <p className="text-body-sm text-text-secondary">
                          {record.completedDateLabel
                            ? translateAdminUserText(record.completedDateLabel, translateText)
                            : record.dueDateLabel
                              ? translateAdminUserText(record.dueDateLabel, translateText)
                              : translateText("No date recorded")}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <FeeBadge label={translateAdminUserText(record.feeLabel, translateText)} tone={getFeeTone(record)} />
                        <AdminStatusBadge
                          label={translateText(paymentConfig.label)}
                          tone={paymentConfig.tone}
                        />
                      </div>
                      <div className="space-y-2">
                        <AdminStatusBadge
                          label={translateText(getBorrowingLabel(record.status))}
                          tone={getBorrowingTone(record.status)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminSectionCard>
  );
}

export { UserBorrowingHistory, type UserBorrowingHistoryProps };