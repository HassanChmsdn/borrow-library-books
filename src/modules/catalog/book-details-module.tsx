"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookMarked, Clock3, HandCoins } from "lucide-react";

import { EmptyState, LoadingSkeleton } from "@/components/feedback";
import {
  AvailabilityBadge,
  BorrowDurationSelector,
  BorrowStatusBadge,
  FeeBadge,
} from "@/components/library";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { AllBooksItem } from "./all-books-data";
import { BookCoverArt } from "./book-cover-art";
import {
  formatBookAvailabilityLabel,
  formatBookFeeLabel,
  getBookAvailabilityTone,
  getBookFeeTone,
} from "./book-presentation";

const borrowDurationOptions = [
  { value: "7-days", label: "7 days", supportingText: "Short hold" },
  { value: "14-days", label: "14 days", supportingText: "Standard" },
  { value: "21-days", label: "21 days", supportingText: "Extended" },
] as const;

interface BookDetailsModuleProps {
  book: AllBooksItem;
}

function BookDetailsModule({ book }: BookDetailsModuleProps) {
  const [selectedDuration, setSelectedDuration] = useState("14-days");
  const [customDurationRequest, setCustomDurationRequest] = useState("");

  const availabilityTone = getBookAvailabilityTone(book);
  const availabilityLabel = formatBookAvailabilityLabel(book);
  const feeLabel = formatBookFeeLabel(book.feeCents);
  const feeTone = getBookFeeTone(book.feeCents);
  const isUnavailable = book.availableCopies === 0;

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Catalog"
        title={book.title}
        description="Book details are still powered by local mock data, but the screen structure is ready for live catalog wiring later."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/books">
              <ArrowLeft className="size-4" />
              Back to catalog
            </Link>
          </Button>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,22rem)] xl:items-start">
        <div className="grid gap-5 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] lg:items-start">
          <div className="mx-auto w-full max-w-sm lg:mx-0">
            <BookCoverArt
              author={book.author}
              coverLabel={book.coverLabel}
              size="detail"
              title={book.title}
              tone={book.coverTone}
            />
          </div>

          <div className="space-y-5">
            <Card>
              <CardHeader className="gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <AvailabilityBadge
                    label={availabilityLabel}
                    tone={availabilityTone}
                  />
                  <FeeBadge label={feeLabel} tone={feeTone} />
                  <BorrowStatusBadge
                    label={isUnavailable ? "Waitlist only" : "Ready to borrow"}
                    tone={isUnavailable ? "danger" : "success"}
                  />
                </div>

                <div className="space-y-2">
                  <CardTitle className="font-heading text-title lg:text-title-lg text-balance">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="text-body">
                    {book.author}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="grid gap-5">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <dt className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                      Category
                    </dt>
                    <dd className="text-body text-foreground font-medium">
                      {book.category}
                    </dd>
                  </div>
                  <div className="space-y-1.5">
                    <dt className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                      Borrow fee
                    </dt>
                    <dd className="text-body text-foreground font-medium">
                      {feeLabel}
                    </dd>
                  </div>
                </dl>

                <div className="space-y-2">
                  <h2 className="text-title-sm text-foreground font-semibold">
                    Description
                  </h2>
                  <p className="text-body text-text-secondary text-pretty">
                    {book.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Borrowing details</CardTitle>
                <CardDescription>
                  Choose a standard duration or request a custom number of days
                  for staff review.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <BorrowDurationSelector
                  description="Predefined durations keep the selection quick on mobile while still scaling to larger screens."
                  label="Borrow duration"
                  options={borrowDurationOptions}
                  onValueChange={setSelectedDuration}
                  value={selectedDuration}
                />

                <label className="grid gap-1.5">
                  <span className="text-label text-foreground font-medium">
                    Custom duration request
                  </span>
                  <Input
                    inputMode="numeric"
                    onChange={(event) =>
                      setCustomDurationRequest(event.target.value)
                    }
                    placeholder="Request a custom number of days"
                    value={customDurationRequest}
                  />
                  <span className="text-body-sm text-text-secondary">
                    Leave blank to use the predefined option above.
                  </span>
                </label>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="xl:sticky xl:top-28">
          <Card>
            <CardHeader>
              <CardTitle>Borrow action</CardTitle>
              <CardDescription>
                Payment is collected onsite in cash only when the book is picked
                up from the library desk.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="bg-elevated rounded-2xl border border-dashed border-black/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-secondary text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <HandCoins className="size-4" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-label text-foreground font-medium">
                      Onsite cash payment only
                    </p>
                    <p className="text-body-sm text-text-secondary">
                      Bring the exact amount when collecting your book. Online
                      checkout and card payments are not available yet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-dashed border-black/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body-sm text-text-secondary">
                    Selected duration
                  </span>
                  <span className="text-body text-foreground font-medium">
                    {
                      borrowDurationOptions.find(
                        (option) => option.value === selectedDuration,
                      )?.label
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body-sm text-text-secondary">
                    Fee due onsite
                  </span>
                  <span className="text-body text-foreground font-medium">
                    {feeLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body-sm text-text-secondary">
                    Availability
                  </span>
                  <span className="text-body text-foreground font-medium">
                    {availabilityLabel}
                  </span>
                </div>
              </div>

              <div className="grid gap-3">
                <Button disabled={isUnavailable} size="lg" type="button">
                  <BookMarked className="size-4" />
                  {isUnavailable ? "Currently unavailable" : "Borrow this book"}
                </Button>
                <Button size="lg" type="button" variant="outline">
                  <Clock3 className="size-4" />
                  Request custom duration
                </Button>
              </div>

              <p className="text-body-sm text-text-secondary">
                This action section is static for now. It models the final
                layout and states without connecting payment, member identity,
                or circulation logic yet.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function BookDetailsEmptyState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Catalog"
        title="Book Details"
        description="The selected book could not be found in the local mock catalog."
      />

      <EmptyState
        action={
          <Button asChild>
            <Link href="/books">Return to all books</Link>
          </Button>
        }
        description="Try another book from the catalog grid. This state is rendered locally so it can be iterated on safely before any backend wiring exists."
        title="Book not available in the mock catalog"
      />
    </div>
  );
}

function BookDetailsLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Catalog"
        title="Book Details"
        description="Preparing the selected title, borrowing options, and payment guidance."
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,22rem)] xl:items-start">
        <div className="grid gap-5 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] lg:items-start">
          <div className="mx-auto w-full max-w-sm lg:mx-0">
            <div className="rounded-card border-border-subtle bg-card aspect-4/5 border p-4 shadow-xs" />
          </div>

          <div className="grid gap-5">
            <LoadingSkeleton count={1} variant="card" />
            <LoadingSkeleton count={1} variant="card" />
          </div>
        </div>

        <LoadingSkeleton count={1} variant="card" />
      </section>
    </div>
  );
}

export { BookDetailsEmptyState, BookDetailsLoadingState, BookDetailsModule };
