import type { LucideIcon } from "lucide-react";

import type { BorrowStatusBadgeTone } from "@/components/library";

export interface AdminCategoriesMetric {
  label: string;
  value: string;
  supportingText: string;
  icon: LucideIcon;
}

export interface AdminCategoryRecord {
  id: string;
  name: string;
  shelfCode: string;
  titles: string;
  activeLoans: string;
  averageFee: string;
  curationNote: string;
  statusLabel: string;
  statusTone: BorrowStatusBadgeTone;
}

export interface AdminCategoryPlanningItem {
  id: string;
  title: string;
  description: string;
  dueLabel: string;
}
