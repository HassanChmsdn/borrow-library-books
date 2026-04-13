"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookCopy, Clock3, ReceiptText } from "lucide-react";

import {
  AdminTable,
  AdminTableBody,
  AdminTableCaption,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin";
import { EmptyState, LoadingSkeleton } from "@/components/feedback";
import { BorrowStatusBadge, FeeBadge } from "@/components/library";
import type { BorrowStatusBadgeTone } from "@/components/library";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MEMBER_AUTH_REGISTRATION_NAME_COOKIE } from "@/lib/auth/member-auth-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { BookCoverArt } from "@/modules/catalog/book-cover-art";
import {
  formatBookFeeLabel,
  getBookFeeTone,
} from "@/modules/catalog/book-presentation";

import {
  myBorrowingsRecords,
  myBorrowingsTabs,
  type BorrowingRecord,
  type MyBorrowingsTab,
} from "./data";

const borrowingTabDescriptions: Record<MyBorrowingsTab, string> = {
  active: "Books currently on loan, including items due soon.",
  pending: "Requests waiting for review or desk pickup confirmation.",
  returned: "Recently completed loans and their payment outcomes.",
  overdue: "Items that need attention before the next renewal cycle.",
};

const borrowingEmptyStates: Record<
  MyBorrowingsTab,
  { title: string; description: string }
> = {
  active: {
    title: "No active borrowings",
    description:
      "You do not have any currently checked out books in the current account view.",
  },
  pending: {
    title: "No pending requests",
    description:
      "New borrowing requests and desk holds will appear here once they are created.",
  },
  returned: {
    title: "No returned books yet",
    description:
      "Completed borrowings will appear here once there is account history beyond the current sample records.",
  },
  overdue: {
    title: "No overdue books",
    description:
      "Any overdue titles will appear here with the next due date and cash payment guidance where needed.",
  },
};

function getBorrowingStatusTone(
  record: BorrowingRecord,
): BorrowStatusBadgeTone {
  if (record.status === "pending-review") {
    return "info";
  }

  if (record.status === "overdue") {
    return "danger";
  }

  if (record.status === "due-soon") {
    return "warning";
  }

  if (record.status === "ready-for-pickup") {
    return "info";
  }

  if (record.status === "checked-out") {
    return "success";
  }

  return "neutral";
}

function BorrowingsMobileCard({
  record,
}: Readonly<{ record: BorrowingRecord }>) {
  return (
    <Card className="overflow-hidden md:hidden">
      <CardContent className="grid gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <BookCoverArt
            author={record.book.author}
            className="w-24 shrink-0"
            coverLabel={record.book.coverLabel}
            title={record.book.title}
            tone={record.book.coverTone}
          />

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <BorrowStatusBadge
                label={record.status === "checked-out" ? "Active" : undefined}
                status={record.status}
                tone={getBorrowingStatusTone(record)}
              />
              <FeeBadge
                label={formatBookFeeLabel(record.book.feeCents)}
                tone={getBookFeeTone(record.book.feeCents)}
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-title-sm text-foreground font-semibold text-balance">
                {record.book.title}
              </h2>
              <p className="text-body-sm text-text-secondary">
                {record.book.author}
              </p>
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                {record.book.category}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-dashed border-black/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <span className="text-body-sm text-text-secondary">
              {record.timelineLabel}
            </span>
            <span
              className={cn(
                "text-body text-right font-medium",
                record.tab === "overdue" ? "text-danger" : "text-foreground",
              )}
            >
              {record.timelineValue}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <span className="text-body-sm text-text-secondary">
              Payment status
            </span>
            <BorrowStatusBadge
              className="shrink-0"
              label={record.paymentStatus.label}
              tone={record.paymentStatus.tone}
            />
          </div>
          <p className="text-body-sm text-text-secondary">
            {record.supportingMeta}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-body-sm text-text-secondary max-w-[16rem]">
            Fees are settled onsite in cash only when pickup or return requires
            payment.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={`/books/${record.book.id}`}>
              View book
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BorrowingsDesktopTable({
  records,
}: Readonly<{ records: ReadonlyArray<BorrowingRecord> }>) {
  return (
    <div className="hidden md:block">
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>Book</AdminTableHead>
            <AdminTableHead>Status</AdminTableHead>
            <AdminTableHead>{"Due / Pickup"}</AdminTableHead>
            <AdminTableHead>Fee</AdminTableHead>
            <AdminTableHead>Payment</AdminTableHead>
            <AdminTableHead className="text-right">Action</AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {records.map((record) => (
            <AdminTableRow key={record.id}>
              <AdminTableCell>
                <div className="flex items-start gap-4">
                  <BookCoverArt
                    author={record.book.author}
                    className="w-16 shrink-0"
                    coverLabel={record.book.coverLabel}
                    title={record.book.title}
                    tone={record.book.coverTone}
                  />
                  <div className="min-w-0 space-y-1.5">
                    <p className="text-body text-foreground font-medium text-balance">
                      {record.book.title}
                    </p>
                    <p className="text-body-sm text-text-secondary">
                      {record.book.author}
                    </p>
                    <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                      {record.book.category}
                    </p>
                  </div>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <BorrowStatusBadge
                  label={record.status === "checked-out" ? "Active" : undefined}
                  status={record.status}
                  tone={getBorrowingStatusTone(record)}
                />
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1">
                  <p
                    className={cn(
                      "text-body font-medium",
                      record.tab === "overdue" ? "text-danger" : "text-foreground",
                    )}
                  >
                    {record.timelineValue}
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    {record.timelineLabel}
                  </p>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <FeeBadge
                  label={formatBookFeeLabel(record.book.feeCents)}
                  tone={getBookFeeTone(record.book.feeCents)}
                />
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-1.5">
                  <BorrowStatusBadge
                    label={record.paymentStatus.label}
                    tone={record.paymentStatus.tone}
                  />
                  <p className="text-body-sm text-text-secondary">
                    {record.supportingMeta}
                  </p>
                </div>
              </AdminTableCell>
              <AdminTableCell className="text-right">
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/books/${record.book.id}`}>View book</Link>
                </Button>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
        <AdminTableCaption>
          Borrowings on this page combine seeded account history and persisted
          pending requests. Cash fees, when present, are paid onsite only.
        </AdminTableCaption>
      </AdminTable>
    </div>
  );
}

interface MyBorrowingsModuleProps {
  persistedRecords?: ReadonlyArray<BorrowingRecord>;
  signupConfirmationName?: string | null;
}

function MyBorrowingsModule({
  persistedRecords,
  signupConfirmationName,
}: Readonly<MyBorrowingsModuleProps>) {
  const [activeTab, setActiveTab] = useState<MyBorrowingsTab>("active");
  const [showSignupConfirmation, setShowSignupConfirmation] = useState(
    Boolean(signupConfirmationName),
  );
  const records = useMemo(
    () => persistedRecords ?? myBorrowingsRecords,
    [persistedRecords],
  );
  const visibleRecords = records.filter((record) => record.tab === activeTab);
  const totalRecords = records.length;

  useEffect(() => {
    if (!signupConfirmationName) {
      return;
    }

    document.cookie = `${MEMBER_AUTH_REGISTRATION_NAME_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
  }, [signupConfirmationName]);

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Account"
        title="My Borrowings"
        description="Track current loans, pending requests, desk pickups, and overdue items in the authenticated member account view."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/books">Browse more books</Link>
          </Button>
        }
      >
        <div className="rounded-card border-border-subtle bg-card grid gap-4 border p-4 shadow-xs sm:p-5">
          {showSignupConfirmation && signupConfirmationName ? (
            <div className="rounded-2xl border border-success-border bg-success-surface flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="text-label text-success font-medium">
                  Registration details saved
                </p>
                <p className="text-body-sm text-text-secondary max-w-2xl">
                  Welcome, {signupConfirmationName}. Your Auth0 signup is complete, and this name is now ready for your local member profile.
                </p>
              </div>

              <Button
                className="shrink-0"
                onClick={() => setShowSignupConfirmation(false)}
                size="sm"
                type="button"
                variant="ghost"
              >
                Dismiss
              </Button>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <p className="text-label text-foreground font-medium">
                {totalRecords} borrowing records
              </p>
              <p className="text-body-sm text-text-secondary max-w-2xl">
                {borrowingTabDescriptions[activeTab]}
              </p>
            </div>

            <div className="bg-elevated rounded-2xl border border-dashed border-black/5 p-4 lg:max-w-xs">
              <div className="flex items-start gap-3">
                <div className="bg-secondary text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <ReceiptText className="size-4" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-label text-foreground font-medium">
                    Payment note
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    Borrowing fees are settled onsite in cash only when a title
                    is picked up or returned with outstanding dues.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2">
              {myBorrowingsTabs.map((tab) => {
                const isActive = tab.value === activeTab;
                const count = records.filter((record) => record.tab === tab.value).length;

                return (
                  <Button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    size="sm"
                    type="button"
                    variant={isActive ? "default" : "outline"}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        "rounded-pill text-caption px-2 py-0.5",
                        isActive
                          ? "bg-primary-foreground/14 text-primary-foreground"
                          : "bg-muted text-text-secondary",
                      )}
                    >
                      {count}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </PageHeader>

      <section aria-labelledby="my-borrowings-title" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2
              id="my-borrowings-title"
              className="text-title-sm text-foreground font-semibold"
            >
              {myBorrowingsTabs.find((tab) => tab.value === activeTab)?.label} records
            </h2>
            <p className="text-body-sm text-text-secondary">
              {visibleRecords.length} {visibleRecords.length === 1 ? "item" : "items"} in this section.
            </p>
          </div>

          <p className="text-body-sm text-text-secondary flex items-center gap-2">
            <Clock3 className="size-4" />
            Due and pickup timing stays visible in both mobile cards and the desktop table.
          </p>
        </div>

        {visibleRecords.length > 0 ? (
          <>
            <div className="grid gap-4 md:hidden">
              {visibleRecords.map((record) => (
                <BorrowingsMobileCard key={record.id} record={record} />
              ))}
            </div>

            <BorrowingsDesktopTable records={visibleRecords} />
          </>
        ) : (
          <EmptyState
            action={
              <Button asChild>
                <Link href="/books">Browse available books</Link>
              </Button>
            }
            description={borrowingEmptyStates[activeTab].description}
            icon={<BookCopy className="size-5" />}
            title={borrowingEmptyStates[activeTab].title}
          />
        )}
      </section>
    </div>
  );
}

function MyBorrowingsLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Account"
        title="My Borrowings"
        description="Preparing your borrowing history, statuses, and payment notes."
      >
        <div className="rounded-card border-border-subtle bg-card grid gap-4 border p-4 shadow-xs sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full max-w-2xl" />
            </div>
            <div className="rounded-2xl border border-dashed border-black/5 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
            </div>
          </div>

          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-10 w-28 rounded-full" />
            ))}
          </div>
        </div>
      </PageHeader>

      <section aria-labelledby="my-borrowings-loading-title" className="space-y-4">
        <div className="space-y-1">
          <h2
            id="my-borrowings-loading-title"
            className="text-title-sm text-foreground font-semibold"
          >
            Borrowing records
          </h2>
          <p className="text-body-sm text-text-secondary">
            Loading the current account view.
          </p>
        </div>

        <div className="grid gap-4 md:hidden">
          <LoadingSkeleton count={2} variant="card" />
        </div>

        <div className="hidden md:block">
          <LoadingSkeleton count={1} variant="table" />
        </div>
      </section>
    </div>
  );
}

export { MyBorrowingsLoadingState, MyBorrowingsModule };
