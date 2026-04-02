import type { LucideIcon } from "lucide-react";

import type { BorrowStatusBadgeTone } from "@/components/library";

export interface AdminDashboardMetric {
  label: string;
  value: string;
  supportingText: string;
  icon: LucideIcon;
  trend?: string;
}

export interface AdminDashboardQueueItem {
  id: string;
  title: string;
  member: string;
  branch: string;
  submittedAt: string;
  dueLabel: string;
  statusLabel: string;
  statusTone: BorrowStatusBadgeTone;
}

export interface AdminDashboardAlertItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  tone: Exclude<BorrowStatusBadgeTone, "neutral">;
}

export interface AdminDashboardBranchPulse {
  id: string;
  branch: string;
  handoffs: string;
  activeLoans: string;
  lowStockTitles: string;
  note: string;
}

export interface AdminDashboardActivityItem {
  id: string;
  title: string;
  meta: string;
  statusLabel: string;
  statusTone: BorrowStatusBadgeTone;
}
