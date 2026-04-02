import { Bell, CircleDollarSign, ShieldCheck, Users } from "lucide-react";

import type {
  AdminUserRecord,
  AdminUsersFilter,
  AdminUsersMetric,
} from "./types";

export const adminUsersMetrics: ReadonlyArray<AdminUsersMetric> = [
  {
    label: "Members",
    value: "342",
    supportingText: "Active across all branches",
    icon: Users,
  },
  {
    label: "Watchlist",
    value: "9",
    supportingText: "Members needing follow-up",
    icon: Bell,
  },
  {
    label: "Cash due",
    value: "$41.50",
    supportingText: "To be settled onsite",
    icon: CircleDollarSign,
  },
  {
    label: "Verified accounts",
    value: "96%",
    supportingText: "Most member records are up to date",
    icon: ShieldCheck,
  },
];

export const adminUsersFilters: ReadonlyArray<{
  label: string;
  value: AdminUsersFilter;
}> = [
  { label: "All members", value: "all" },
  { label: "Active", value: "active" },
  { label: "Watchlist", value: "watchlist" },
  { label: "Cash due", value: "cash-due" },
  { label: "New", value: "new" },
];

export const adminUsersRecords: ReadonlyArray<AdminUserRecord> = [
  {
    id: "user-sara",
    name: "Sara Chehab",
    email: "sara@example.com",
    branch: "Downtown",
    plan: "Community plan",
    activeLoans: "2 active loans",
    balanceLabel: "No balance",
    paymentLabel: "Current",
    paymentTone: "success",
    statusLabel: "Active",
    statusTone: "success",
    filter: "active",
  },
  {
    id: "user-noor",
    name: "Noor Haddad",
    email: "noor@example.com",
    branch: "Hamra",
    plan: "Student plan",
    activeLoans: "1 pickup pending",
    balanceLabel: "$2.50 due",
    paymentLabel: "Cash due",
    paymentTone: "warning",
    statusLabel: "Cash due",
    statusTone: "warning",
    filter: "cash-due",
  },
  {
    id: "user-lina",
    name: "Lina Saab",
    email: "lina@example.com",
    branch: "Byblos",
    plan: "Reader plan",
    activeLoans: "1 overdue item",
    balanceLabel: "No balance",
    paymentLabel: "Reminder sent",
    paymentTone: "danger",
    statusLabel: "Watchlist",
    statusTone: "danger",
    filter: "watchlist",
  },
  {
    id: "user-jad",
    name: "Jad Fares",
    email: "jad@example.com",
    branch: "Hamra",
    plan: "Research plan",
    activeLoans: "3 active loans",
    balanceLabel: "$3.50 due at return",
    paymentLabel: "Cash at return",
    paymentTone: "warning",
    statusLabel: "Active",
    statusTone: "success",
    filter: "active",
  },
  {
    id: "user-rima",
    name: "Rima Azar",
    email: "rima@example.com",
    branch: "Downtown",
    plan: "New member",
    activeLoans: "No current loans",
    balanceLabel: "No balance",
    paymentLabel: "Current",
    paymentTone: "success",
    statusLabel: "New",
    statusTone: "info",
    filter: "new",
  },
];
