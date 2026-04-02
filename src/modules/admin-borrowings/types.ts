import type { LucideIcon } from "lucide-react";

import type { BorrowStatusBadgeTone } from "@/components/library";

export type AdminBorrowingsTab = "active" | "pending" | "returned" | "overdue";

export type AdminBorrowingsPaymentTone = BorrowStatusBadgeTone;

export interface AdminBorrowingsMetric {
  label: string;
  value: string;
  supportingText: string;
  icon: LucideIcon;
}

export interface AdminBorrowingRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  memberName: string;
  memberPlan: string;
  branch: string;
  dueLabel: string;
  dueValue: string;
  feeCents: number;
  paymentLabel: string;
  paymentTone: AdminBorrowingsPaymentTone;
  statusLabel: string;
  statusTone: BorrowStatusBadgeTone;
  tab: AdminBorrowingsTab;
}
