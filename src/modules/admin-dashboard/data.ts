import { BookCopy, Clock3, PackageOpen, Users } from "lucide-react";

import type {
  AdminDashboardActivityItem,
  AdminDashboardAlertItem,
  AdminDashboardBranchPulse,
  AdminDashboardMetric,
  AdminDashboardQueueItem,
} from "./types";

export const adminDashboardMetrics: ReadonlyArray<AdminDashboardMetric> = [
  {
    label: "Active loans",
    value: "128",
    supportingText: "12 checkouts above last week",
    icon: BookCopy,
    trend: "+10%",
  },
  {
    label: "Pending requests",
    value: "14",
    supportingText: "6 requests need assignment today",
    icon: Clock3,
    trend: "+3",
  },
  {
    label: "Inventory alerts",
    value: "7",
    supportingText: "4 branches need replenishment review",
    icon: PackageOpen,
    trend: "2 urgent",
  },
  {
    label: "Active members",
    value: "342",
    supportingText: "18 new members joined this month",
    icon: Users,
    trend: "+18",
  },
];

export const adminDashboardQueue: ReadonlyArray<AdminDashboardQueueItem> = [
  {
    id: "queue-clean-code",
    title: "Reserve Clean Code",
    member: "Sara Chehab",
    branch: "Downtown",
    submittedAt: "18 minutes ago",
    dueLabel: "Assign by 3:30 PM",
    statusLabel: "Needs assignment",
    statusTone: "warning",
  },
  {
    id: "queue-gatsby-renewal",
    title: "Renew The Great Gatsby",
    member: "Karim Youssef",
    branch: "Hamra",
    submittedAt: "42 minutes ago",
    dueLabel: "Due tomorrow",
    statusLabel: "Eligible",
    statusTone: "success",
  },
  {
    id: "queue-sapiens-reminder",
    title: "Pickup reminder for Sapiens",
    member: "Noor Haddad",
    branch: "Byblos",
    submittedAt: "1 hour ago",
    dueLabel: "Hold expires in 4 hours",
    statusLabel: "Send reminder",
    statusTone: "info",
  },
];

export const adminDashboardAlerts: ReadonlyArray<AdminDashboardAlertItem> = [
  {
    id: "alert-meditations",
    title: "Meditations",
    description:
      "All copies are currently checked out and two more requests are waiting for assignment.",
    meta: "Add a copy to Downtown or move one from Hamra.",
    tone: "danger",
  },
  {
    id: "alert-thinking-fast",
    title: "Thinking, Fast and Slow",
    description:
      "Demand is rising across weekend branches and the queue is stretching past three readers.",
    meta: "Review wait-list pacing before Friday.",
    tone: "warning",
  },
  {
    id: "alert-travel-shelf",
    title: "Travel shelf",
    description:
      "Travel titles are balanced again after the morning returns were processed.",
    meta: "No follow-up required today.",
    tone: "success",
  },
];

export const adminDashboardBranchPulse: ReadonlyArray<AdminDashboardBranchPulse> =
  [
    {
      id: "branch-downtown",
      branch: "Downtown",
      handoffs: "48 handoffs",
      activeLoans: "96 active loans",
      lowStockTitles: "3 low-stock titles",
      note: "Highest pickup volume today with strong return compliance.",
    },
    {
      id: "branch-hamra",
      branch: "Hamra",
      handoffs: "31 handoffs",
      activeLoans: "74 active loans",
      lowStockTitles: "1 low-stock title",
      note: "Steady fiction demand with healthy shelf depth across science titles.",
    },
    {
      id: "branch-byblos",
      branch: "Byblos",
      handoffs: "19 handoffs",
      activeLoans: "42 active loans",
      lowStockTitles: "4 low-stock titles",
      note: "Borrowing volume is lighter, but overdue reminders need review.",
    },
  ];

export const adminDashboardActivity: ReadonlyArray<AdminDashboardActivityItem> =
  [
    {
      id: "activity-returns",
      title: "Morning returns processed",
      meta: "12 books checked back in before 11:00 AM.",
      statusLabel: "Completed",
      statusTone: "success",
    },
    {
      id: "activity-balances",
      title: "Cash balance reminders sent",
      meta: "4 members were reminded about onsite settlement at pickup.",
      statusLabel: "Sent",
      statusTone: "info",
    },
    {
      id: "activity-restock",
      title: "Restock review pending",
      meta: "Inventory coordinator still needs to confirm two transfers.",
      statusLabel: "Pending",
      statusTone: "warning",
    },
  ];
