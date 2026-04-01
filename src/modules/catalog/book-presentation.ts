import type {
  AvailabilityBadgeTone,
  BookCardStatusTone,
  FeeBadgeTone,
} from "@/components/library";

import type { AllBooksItem } from "./all-books-data";

function formatBookFeeLabel(feeCents: number) {
  if (feeCents === 0) {
    return "Free";
  }

  return `$${(feeCents / 100).toFixed(2)} cash`;
}

function getBookFeeTone(feeCents: number): FeeBadgeTone {
  return feeCents === 0 ? "free" : "paid";
}

function getBookAvailabilityTone(book: AllBooksItem): AvailabilityBadgeTone {
  if (book.availableCopies === 0) {
    return "unavailable";
  }

  if (book.availableCopies / book.totalCopies <= 0.34) {
    return "limited";
  }

  return "available";
}

function formatBookAvailabilityLabel(book: AllBooksItem) {
  return `${book.availableCopies}/${book.totalCopies} available`;
}

function getBookStatusLabel(book: AllBooksItem) {
  if (book.availableCopies === 0) {
    return "Unavailable";
  }

  if (book.availableCopies === 1) {
    return "Low stock";
  }

  if (book.feeCents === 0) {
    return "Free pick";
  }

  return "Available";
}

function getBookStatusTone(book: AllBooksItem): BookCardStatusTone {
  if (book.availableCopies === 0) {
    return "danger";
  }

  if (book.availableCopies === 1) {
    return "warning";
  }

  return book.feeCents === 0 ? "success" : "info";
}

export {
  formatBookAvailabilityLabel,
  formatBookFeeLabel,
  getBookAvailabilityTone,
  getBookFeeTone,
  getBookStatusLabel,
  getBookStatusTone,
};
