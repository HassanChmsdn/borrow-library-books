import type { BookCoverTone } from "@/modules/catalog/all-books-data";

import type {
  AvailabilityBadgeTone,
  BorrowStatusBadgeTone,
} from "@/components/library";

export type AdminBooksCategory =
  | "All"
  | "Fiction"
  | "Science"
  | "History"
  | "Philosophy"
  | "Technology"
  | "Art & Design"
  | "Business"
  | "Travel";

export type AdminBooksStatusFilter = "all" | "healthy" | "limited" | "archived";

export type AdminBooksSortValue =
  | "updated"
  | "title"
  | "author"
  | "availability"
  | "fee";

export interface AdminBookRecord {
  id: string;
  title: string;
  author: string;
  category: Exclude<AdminBooksCategory, "All">;
  shelfCode: string;
  totalCopies: number;
  availableCopies: number;
  feeCents: number;
  coverTone: BookCoverTone;
  coverLabel: string;
  availabilityTone: AvailabilityBadgeTone;
  statusLabel: string;
  statusTone: BorrowStatusBadgeTone;
}

export interface AdminBooksModuleProps {
  isLoading?: boolean;
  onAddBook?: () => void;
  onDeleteBook?: (book: AdminBookRecord) => void;
  onEditBook?: (book: AdminBookRecord) => void;
  records?: ReadonlyArray<AdminBookRecord>;
}
