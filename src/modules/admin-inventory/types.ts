import type { LucideIcon } from "lucide-react";

import type {
  AvailabilityBadgeTone,
  BorrowStatusBadgeTone,
} from "@/components/library";

export type AdminInventoryBranch =
  | "All branches"
  | "Downtown"
  | "Hamra"
  | "Byblos";

export interface AdminInventoryMetric {
  label: string;
  value: string;
  supportingText: string;
  icon: LucideIcon;
}

export interface AdminInventoryAlertItem {
  id: string;
  title: string;
  description: string;
  tone: BorrowStatusBadgeTone;
}

export interface AdminInventoryRecord {
  id: string;
  title: string;
  branch: Exclude<AdminInventoryBranch, "All branches">;
  shelfCode: string;
  availableCopies: number;
  totalCopies: number;
  availabilityTone: AvailabilityBadgeTone;
  nextAction: string;
  actionTone: BorrowStatusBadgeTone;
  lastAudit: string;
}

export interface AdminInventoryBranchCard {
  id: string;
  branch: Exclude<AdminInventoryBranch, "All branches">;
  healthyShelves: string;
  reviewItems: string;
  note: string;
}
