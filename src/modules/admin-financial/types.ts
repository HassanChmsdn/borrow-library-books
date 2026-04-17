import type { AdminStatusBadgeTone } from "@/components/admin";

export interface AdminFinancialRecord {
  activityLabel: string;
  activityOn: string;
  bookTitle: string;
  branch: string;
  feeCents: number;
  id: string;
  isOverdueCash: boolean;
  memberEmail: string;
  memberName: string;
  paymentHelperText?: string;
  paymentStatusLabel: string;
  paymentStatusTone: AdminStatusBadgeTone;
}

export interface AdminFinancialSummary {
  collectionRate: number;
  feeBearingRecordCount: number;
  last30DaySettledRevenueCents: number;
  overdueCashCount: number;
  outstandingRevenueCents: number;
  settledRecordCount: number;
  settledRevenueCents: number;
}

export interface AdminFinancialModuleData {
  recentRecords: ReadonlyArray<AdminFinancialRecord>;
  summary: AdminFinancialSummary;
}

export interface AdminFinancialModuleProps {
  data: AdminFinancialModuleData;
  isLoading?: boolean;
}