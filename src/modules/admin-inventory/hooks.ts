"use client";

import { useState } from "react";

import {
  adminInventoryAlerts,
  adminInventoryBranchCards,
  adminInventoryBranches,
  adminInventoryMetrics,
  adminInventoryRecords,
} from "./data";
import type { AdminInventoryBranch } from "./types";

export function useAdminInventoryModuleState() {
  const [activeBranch, setActiveBranch] =
    useState<AdminInventoryBranch>("All branches");

  const records = adminInventoryRecords.filter((record) =>
    activeBranch === "All branches" ? true : record.branch === activeBranch,
  );

  const branchCards = adminInventoryBranchCards.filter((card) =>
    activeBranch === "All branches" ? true : card.branch === activeBranch,
  );

  return {
    activeBranch,
    alerts: adminInventoryAlerts,
    branches: adminInventoryBranches,
    branchCards,
    metrics: adminInventoryMetrics,
    records,
    setActiveBranch,
  };
}
