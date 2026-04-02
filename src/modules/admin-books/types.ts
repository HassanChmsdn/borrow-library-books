import type { LucideIcon } from "lucide-react";

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

export interface AdminBooksMetric {
  label: string;
  value: string;
  supportingText: string;
  icon: LucideIcon;
}

export interface AdminBookRecord {
  id: string;
  title: string;
  author: string;
  category: Exclude<AdminBooksCategory, "All">;
  branch: string;
  shelfCode: string;
  totalCopies: number;
  availableCopies: number;
  feeCents: number;
  lastUpdated: string;
  coverTone: BookCoverTone;
  coverLabel: string;
  availabilityTone: AvailabilityBadgeTone;
  workflowLabel: string;
  workflowTone: BorrowStatusBadgeTone;
  statusFilter: Exclude<AdminBooksStatusFilter, "all">;
}
