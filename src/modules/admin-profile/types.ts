import type { AdminSharedStatusTone } from "@/modules/admin-shared/types";

export interface AdminProfileMetric {
  label: string;
  supportingText: string;
  value: string;
}

export interface AdminProfileActivityRecord {
  description: string;
  id: string;
  occurredLabel: string;
  statusLabel: string;
  statusTone: AdminSharedStatusTone;
  title: string;
}

export interface AdminProfileRecord {
  accountSummaryNote: string;
  detailItems: ReadonlyArray<{
    hint?: string;
    label: string;
    value: string;
  }>;
  email: string;
  fullName: string;
  id: string;
  joinedDateLabel: string;
  metrics: ReadonlyArray<AdminProfileMetric>;
  recentActivity: ReadonlyArray<AdminProfileActivityRecord>;
  role: "admin";
  status: "active";
  subtitle: string;
}

export interface AdminProfileModuleProps {
  isLoading?: boolean;
  profile?: AdminProfileRecord;
}