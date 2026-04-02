import type { LucideIcon } from "lucide-react";

import type { BorrowStatusBadgeTone } from "@/components/library";

export type AdminUsersFilter =
  | "all"
  | "active"
  | "watchlist"
  | "cash-due"
  | "new";

export interface AdminUsersMetric {
  label: string;
  value: string;
  supportingText: string;
  icon: LucideIcon;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  branch: string;
  plan: string;
  activeLoans: string;
  balanceLabel: string;
  paymentLabel: string;
  paymentTone: BorrowStatusBadgeTone;
  statusLabel: string;
  statusTone: BorrowStatusBadgeTone;
  filter: Exclude<AdminUsersFilter, "all">;
}
