import {
  ClipboardCheck,
  PackageOpen,
  RefreshCcw,
  Warehouse,
} from "lucide-react";

import type {
  AdminInventoryAlertItem,
  AdminInventoryBranch,
  AdminInventoryBranchCard,
  AdminInventoryMetric,
  AdminInventoryRecord,
} from "./types";

export const adminInventoryMetrics: ReadonlyArray<AdminInventoryMetric> = [
  {
    label: "Tracked copies",
    value: "412",
    supportingText: "Across all admin-managed shelves",
    icon: Warehouse,
  },
  {
    label: "Low stock",
    value: "11",
    supportingText: "Need transfer or reorder planning",
    icon: PackageOpen,
  },
  {
    label: "Audits due",
    value: "5",
    supportingText: "Branch shelf checks scheduled this week",
    icon: ClipboardCheck,
  },
  {
    label: "Transfers",
    value: "3",
    supportingText: "Pending coordinator approval",
    icon: RefreshCcw,
  },
];

export const adminInventoryBranches: ReadonlyArray<AdminInventoryBranch> = [
  "All branches",
  "Downtown",
  "Hamra",
  "Byblos",
];

export const adminInventoryAlerts: ReadonlyArray<AdminInventoryAlertItem> = [
  {
    id: "inventory-alert-meditations",
    title: "Meditations is fully checked out",
    description:
      "No available copies remain at Downtown. Review transfer options before weekend demand peaks.",
    tone: "danger",
  },
  {
    id: "inventory-alert-clean-code",
    title: "Clean Code is running low",
    description:
      "Only one copy is still available and two renewals were requested today.",
    tone: "warning",
  },
  {
    id: "inventory-alert-travel",
    title: "Travel shelf is healthy",
    description:
      "Travel titles returned this morning restored shelf balance without manual moves.",
    tone: "success",
  },
];

export const adminInventoryRecords: ReadonlyArray<AdminInventoryRecord> = [
  {
    id: "inventory-1984",
    title: "1984",
    branch: "Downtown",
    shelfCode: "FIC-19",
    availableCopies: 4,
    totalCopies: 6,
    availabilityTone: "available",
    nextAction: "Monitor demand",
    actionTone: "info",
    lastAudit: "Audited today",
  },
  {
    id: "inventory-clean-code",
    title: "Clean Code",
    branch: "Downtown",
    shelfCode: "TEC-14",
    availableCopies: 1,
    totalCopies: 3,
    availabilityTone: "limited",
    nextAction: "Consider transfer",
    actionTone: "warning",
    lastAudit: "Audited yesterday",
  },
  {
    id: "inventory-meditations",
    title: "Meditations",
    branch: "Downtown",
    shelfCode: "PHI-03",
    availableCopies: 0,
    totalCopies: 2,
    availabilityTone: "unavailable",
    nextAction: "Restock urgently",
    actionTone: "danger",
    lastAudit: "Audited 2 hours ago",
  },
  {
    id: "inventory-brief-history",
    title: "A Brief History of Time",
    branch: "Hamra",
    shelfCode: "SCI-08",
    availableCopies: 1,
    totalCopies: 3,
    availabilityTone: "limited",
    nextAction: "Review hold queue",
    actionTone: "warning",
    lastAudit: "Audited this morning",
  },
  {
    id: "inventory-into-the-wild",
    title: "Into the Wild",
    branch: "Byblos",
    shelfCode: "TRA-02",
    availableCopies: 4,
    totalCopies: 4,
    availabilityTone: "available",
    nextAction: "No action needed",
    actionTone: "success",
    lastAudit: "Audited yesterday",
  },
];

export const adminInventoryBranchCards: ReadonlyArray<AdminInventoryBranchCard> =
  [
    {
      id: "branch-card-downtown",
      branch: "Downtown",
      healthyShelves: "18 healthy shelves",
      reviewItems: "4 titles need review",
      note: "Highest branch turnover with the heaviest weekend pressure.",
    },
    {
      id: "branch-card-hamra",
      branch: "Hamra",
      healthyShelves: "12 healthy shelves",
      reviewItems: "2 titles need review",
      note: "Stable circulation with science demand rising.",
    },
    {
      id: "branch-card-byblos",
      branch: "Byblos",
      healthyShelves: "9 healthy shelves",
      reviewItems: "3 titles need review",
      note: "Lighter traffic but more overdue follow-up work.",
    },
  ];
