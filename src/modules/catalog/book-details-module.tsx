"use client";

import { startTransition, useMemo, useState } from "react";
import { ArrowLeft, BookMarked, Clock3, HandCoins } from "lucide-react";

import { EmptyState, LoadingSkeleton } from "@/components/feedback";
import {
  AvailabilityBadge,
  BorrowDurationSelector,
  BorrowStatusBadge,
  FeeBadge,
} from "@/components/library";
import { buildMockSignInHref } from "@/lib/auth";
import { useMockAuth } from "@/lib/auth/react";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";

import type { AllBooksItem } from "./all-books-data";
import { createBookBorrowRequestAction } from "./actions";
import { BookCoverArt } from "./book-cover-art";
import {
  initialBookBorrowRequestState,
  type BookBorrowRequestState,
} from "./borrow-request";
import {
  formatBookAvailabilityLabel,
  formatBookFeeLabel,
  getBookAvailabilityTone,
  getBookFeeTone,
} from "./book-presentation";
import {
  translateCatalogAvailabilityLabel,
  translateCatalogFeeLabel,
} from "./i18n";

const borrowDurationOptions = [
  { value: "7", label: "7 days", supportingText: "Short hold" },
  { value: "14", label: "14 days", supportingText: "Standard" },
  { value: "21", label: "21 days", supportingText: "Extended" },
] as const;

interface BookDetailsModuleProps {
  allowCustomDuration: boolean;
  book: AllBooksItem;
}

function BookDetailsModule({ allowCustomDuration, book }: BookDetailsModuleProps) {
  const { translateText } = useI18n();
  const [selectedDuration, setSelectedDuration] = useState("14");
  const [customDurationRequest, setCustomDurationRequest] = useState("");
  const [requestState, setRequestState] = useState<BookBorrowRequestState>(
    initialBookBorrowRequestState,
  );
  const [submittingMode, setSubmittingMode] = useState<
    "custom" | "predefined" | null
  >(null);
  const { hasAdminAccess, isMember } = useMockAuth();

  const availabilityTone = getBookAvailabilityTone(book);
  const availabilityLabel = translateCatalogAvailabilityLabel(
    formatBookAvailabilityLabel(book),
    translateText,
  );
  const feeLabel = translateCatalogFeeLabel(
    formatBookFeeLabel(book.feeCents),
    translateText,
  );
  const feeTone = getBookFeeTone(book.feeCents);
  const isUnavailable = book.availableCopies === 0;
  const customDurationAllowed = useMemo(() => allowCustomDuration, [allowCustomDuration]);
  const memberBorrowingHref = `/books/${encodeURIComponent(book.id)}`;
  const borrowHref = isMember
    ? memberBorrowingHref
    : buildMockSignInHref({
        role: "member",
        redirectTo: memberBorrowingHref,
      });
  const borrowPrimaryLabel = isMember
    ? "Borrow this book"
    : hasAdminAccess
      ? "Switch to member to borrow"
      : "Sign in to borrow";
  const customDurationLabel = isMember
    ? "Request custom duration"
    : hasAdminAccess
      ? "Switch to member for custom duration"
      : "Sign in for custom duration";
  const borrowHelperText = isMember
    ? "Borrow requests are created from this page and the first available physical copy is assigned automatically. My Borrowings remains the member list and status page."
    : hasAdminAccess
      ? "Mock admin sessions cannot borrow titles directly. Switch to a member session to continue into the borrowing flow."
      : "Borrowing actions require a member session. Guests can keep browsing publicly and sign in only when they are ready to borrow.";

  const handleBorrowRequest = (mode: "custom" | "predefined") => {
    if (!isMember || isUnavailable) {
      return;
    }

    if (mode === "custom") {
      if (!customDurationAllowed) {
        setRequestState({
          message: translateText(
            "Custom duration requests are not available for this title.",
          ),
          status: "error",
        });
        return;
      }

      if (customDurationRequest.trim().length === 0) {
        setRequestState({
          message: translateText(
            "Enter the number of days you want to request before submitting a custom duration.",
          ),
          status: "error",
        });
        return;
      }
    }

    setSubmittingMode(mode);

    const formData = new FormData();
    formData.set("bookId", book.id);
    formData.set("durationOption", selectedDuration);
    formData.set("requestMode", mode);

    if (mode === "custom") {
      formData.set("customDurationDays", customDurationRequest.trim());
    }

    startTransition(async () => {
      const nextState = await createBookBorrowRequestAction(formData);
      setRequestState(nextState);
      setSubmittingMode(null);

      if (nextState.status === "success") {
        setCustomDurationRequest("");
      }
    });
  };

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Catalog"
        title={book.title}
        description="Review availability, borrowing duration options, and onsite fee policy before placing a borrowing request."
        actions={
          <LinkButton href="/books" size="sm" variant="outline">
              <ArrowLeft className="size-4" />
              Back to catalog
          </LinkButton>
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
                  <CardTitle className="font-heading text-title text-balance lg:text-title-lg">
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
                      {translateText("Category")}
                    </dt>
                    <dd className="text-body text-foreground font-medium">
                      {translateText(book.category)}
                    </dd>
                  </div>
                  <div className="space-y-1.5">
                    <dt className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                      {translateText("Borrow fee")}
                    </dt>
                    <dd className="text-body text-foreground font-medium">
                      {feeLabel}
                    </dd>
                  </div>
                </dl>

                <div className="space-y-2">
                  <h2 className="text-title-sm text-foreground font-semibold">
                    {translateText("Description")}
                  </h2>
                  <p className="text-body text-text-secondary text-pretty">
                    {book.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{translateText("Borrowing details")}</CardTitle>
                <CardDescription>
                  {translateText(
                    "Choose a standard duration or request a custom number of days for staff review.",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <BorrowDurationSelector
                  description={translateText(
                    "Predefined durations keep the selection quick on mobile while still scaling to larger screens.",
                  )}
                  label="Borrow duration"
                  options={borrowDurationOptions}
                  onValueChange={setSelectedDuration}
                  value={selectedDuration}
                />

                <label className="grid gap-1.5">
                  <span className="text-label text-foreground font-medium">
                    {translateText("Custom duration request")}
                  </span>
                  <Input
                    disabled={!customDurationAllowed}
                    inputMode="numeric"
                    onChange={(event) =>
                      setCustomDurationRequest(event.target.value)
                    }
                    placeholder={
                      customDurationAllowed
                        ? translateText("Request a custom number of days")
                        : translateText("Custom requests are unavailable for this title")
                    }
                    value={customDurationRequest}
                  />
                  <span className="text-body-sm text-text-secondary">
                    {customDurationAllowed
                      ? translateText(
                          "Leave blank to use the predefined option above. The first available copy is assigned automatically.",
                        )
                      : translateText("This title uses predefined borrowing durations only.")}
                  </span>
                </label>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="xl:sticky xl:top-28">
          <Card>
            <CardHeader>
              <CardTitle>{translateText("Borrow action")}</CardTitle>
              <CardDescription>
                {translateText(
                  "Payment is collected onsite in cash only when the book is picked up from the library desk.",
                )}
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
                      {translateText("Onsite cash payment only")}
                    </p>
                    <p className="text-body-sm text-text-secondary">
                      {translateText(
                        "Bring the exact amount when collecting your book. Online checkout and card payments are not available yet.",
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-dashed border-black/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body-sm text-text-secondary">
                    {translateText("Selected duration")}
                  </span>
                  <span className="text-body text-foreground font-medium">
                    {translateText(
                      borrowDurationOptions.find(
                        (option) => option.value === selectedDuration,
                      )?.label ?? "",
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body-sm text-text-secondary">
                    {translateText("Fee due onsite")}
                  </span>
                  <span className="text-body text-foreground font-medium">
                    {feeLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body-sm text-text-secondary">
                    {translateText("Availability")}
                  </span>
                  <span className="text-body text-foreground font-medium">
                    {availabilityLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body-sm text-text-secondary">
                    {translateText("Copy assignment")}
                  </span>
                  <span className="text-body text-foreground font-medium">
                    {translateText("First available copy")}
                  </span>
                </div>
              </div>

              {requestState.message ? (
                <div
                  className={
                    requestState.status === "success"
                      ? "border-success-border bg-success-surface text-success rounded-2xl border px-4 py-3"
                      : "border-danger-border bg-danger-surface text-danger rounded-2xl border px-4 py-3"
                  }
                >
                  <p className="text-body-sm font-medium">{requestState.message}</p>
                  {requestState.status === "success" ? (
                    <LinkButton className="mt-3" href="/account/borrowings" size="sm" variant="outline">
                      View My Borrowings
                    </LinkButton>
                  ) : null}
                </div>
              ) : null}

              <div className="grid gap-3">
                {isUnavailable ? (
                  <Button disabled size="lg" type="button">
                    <BookMarked className="size-4" />
                    {translateText("Currently unavailable")}
                  </Button>
                ) : isMember ? (
                  <Button
                    disabled={submittingMode !== null}
                    onClick={() => handleBorrowRequest("predefined")}
                    size="lg"
                    type="button"
                  >
                    <BookMarked className="size-4" />
                    {submittingMode === "predefined"
                      ? translateText("Creating request...")
                      : borrowPrimaryLabel}
                  </Button>
                ) : (
                  <LinkButton href={borrowHref} size="lg">
                      <BookMarked className="size-4" />
                      {borrowPrimaryLabel}
                  </LinkButton>
                )}

                {isMember ? (
                  <Button
                    disabled={submittingMode !== null || !customDurationAllowed}
                    onClick={() => handleBorrowRequest("custom")}
                    size="lg"
                    type="button"
                    variant="outline"
                  >
                    <Clock3 className="size-4" />
                    {submittingMode === "custom"
                      ? translateText("Submitting request...")
                      : customDurationAllowed
                        ? customDurationLabel
                        : translateText("Custom duration unavailable")}
                  </Button>
                ) : (
                  <LinkButton href={borrowHref} size="lg" variant="outline">
                      <Clock3 className="size-4" />
                      {customDurationLabel}
                  </LinkButton>
                )}
              </div>

              <p className="text-body-sm text-text-secondary">
                {translateText(borrowHelperText)}
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
          <LinkButton href="/books">Browse Books</LinkButton>
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
            <div
              className="rounded-card border-border-subtle bg-card border p-4 shadow-xs"
              style={{ aspectRatio: "4 / 5" }}
            />
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
