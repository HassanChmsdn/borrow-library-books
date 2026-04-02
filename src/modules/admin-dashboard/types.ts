import type { LucideIcon } from "lucide-react";

import type { BorrowStatusBadgeTone } from "@/components/library";

export interface AdminDashboardMetric {
  id: string;
  label: string;
  value: string;
  supportingText: string;
  icon: LucideIcon;
  trend?: string;
  tone: BorrowStatusBadgeTone;
}

export interface AdminDashboardNoticeItem {
  id: string;
  title: string;
  badgeLabel?: string;
  description: string;
  meta: string;
  countLabel: string;
  actionLabel: string;
  actionHref: string;
  tone: Exclude<BorrowStatusBadgeTone, "neutral">;
}

export interface AdminDashboardTrendPoint {
  id: string;
  label: string;
  borrowings: number;
  returns: number;
  overdue: number;
}

export interface AdminDashboardTrendSummaryItem {
  id: string;
  label: string;
  value: string;
  hint?: string;
  statusLabel?: string;
  statusTone?: BorrowStatusBadgeTone;
}

export interface AdminDashboardActivityItem {
  id: string;
  title: string;
  description: string;
  actor: string;
  actorRole: string;
  meta: string;
  statusLabel: string;
  statusTone: BorrowStatusBadgeTone;
}

export interface AdminDashboardQuickAction {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  icon: LucideIcon;
}
