import {
  BookCopy,
  Clock3,
  HandCoins,
  PackageOpen,
  TriangleAlert,
  Users,
} from "lucide-react";

import type {
  AdminDashboardActivityItem,
  AdminDashboardMetric,
  AdminDashboardNoticeItem,
  AdminDashboardQuickAction,
  AdminDashboardTrendPoint,
  AdminDashboardTrendSummaryItem,
} from "./types";

export const adminDashboardMetrics: ReadonlyArray<AdminDashboardMetric> = [
  {
    id: "pending",
    label: "Pending requests",
    value: "14",
    supportingText: "Approvals and pickup assignments waiting today",
    icon: Clock3,
    trend: "+4 since opening",
    tone: "warning",
  },
  {
    id: "active",
    label: "Active loans",
    value: "128",
    supportingText: "Borrowings currently out across all library branches",
    icon: BookCopy,
    trend: "+12 this week",
    tone: "info",
  },
  {
    id: "overdue",
    label: "Overdue follow-up",
    value: "9",
    supportingText: "Accounts that need staff follow-up before close",
    icon: TriangleAlert,
    trend: "3 critical",
    tone: "danger",
  },
  {
    id: "revenue",
    label: "Cash revenue",
    value: "$1,460",
    supportingText: "Onsite cash fees settled this week at circulation desks",
    icon: HandCoins,
    trend: "+8% vs last week",
    tone: "success",
  },
  {
    id: "users",
    label: "Active users",
    value: "342",
    supportingText: "Members with activity in the last 30 days",
    icon: Users,
    trend: "+18",
    tone: "info",
  },
];

export const adminDashboardNotices: ReadonlyArray<AdminDashboardNoticeItem> = [
  {
    id: "notice-pending-requests",
    title: "Pending requests",
    badgeLabel: "Pending",
    description:
      "Pickup approvals and assignment requests are clustering around the midday circulation window.",
    meta: "6 records need confirmation before 3:30 PM.",
    countLabel: "14 open items",
    actionLabel: "Open borrowings",
    actionHref: "/admin/borrowings",
    tone: "warning",
  },
  {
    id: "notice-overdue-follow-up",
    title: "Overdue follow-up",
    badgeLabel: "Overdue",
    description:
      "Several readers passed their due windows and need coordinated follow-up before evening rounds.",
    meta: "3 accounts are now in the critical range.",
    countLabel: "9 overdue cases",
    actionLabel: "Review users",
    actionHref: "/admin/users",
    tone: "danger",
  },
];

export const adminDashboardTrendPoints: ReadonlyArray<AdminDashboardTrendPoint> =
  [
    {
      id: "monday",
      label: "Mon",
      borrowings: 18,
      returns: 12,
      overdue: 2,
    },
    {
      id: "tuesday",
      label: "Tue",
      borrowings: 22,
      returns: 16,
      overdue: 1,
    },
    {
      id: "wednesday",
      label: "Wed",
      borrowings: 26,
      returns: 19,
      overdue: 3,
    },
    {
      id: "thursday",
      label: "Thu",
      borrowings: 24,
      returns: 18,
      overdue: 2,
    },
    {
      id: "friday",
      label: "Fri",
      borrowings: 29,
      returns: 21,
      overdue: 4,
    },
    {
      id: "saturday",
      label: "Sat",
      borrowings: 21,
      returns: 17,
      overdue: 2,
    },
    {
      id: "sunday",
      label: "Sun",
      borrowings: 17,
      returns: 14,
      overdue: 1,
    },
  ];

export const adminDashboardTrendSummary: ReadonlyArray<AdminDashboardTrendSummaryItem> =
  [
    {
      id: "seven-day-borrows",
      label: "7-day borrowings",
      value: "157 loans",
      hint: "Average of 22 loans per day across branches.",
    },
    {
      id: "return-rate",
      label: "On-time return rate",
      value: "92%",
      hint: "Comfortably above the weekly target.",
      statusLabel: "Healthy",
      statusTone: "success",
    },
    {
      id: "cash-settled",
      label: "Cash settled onsite",
      value: "$1,460",
      hint: "All fee collection remains desk-based cash only.",
      statusLabel: "Onsite only",
      statusTone: "warning",
    },
  ];

export const adminDashboardActivity: ReadonlyArray<AdminDashboardActivityItem> =
  [
    {
      id: "activity-returns",
      title: "Morning return wave processed",
      description:
        "Circulation confirmed 12 returns and released 5 reserved titles back into active stock.",
      actor: "Rami Nader",
      actorRole: "Circulation desk",
      meta: "12 minutes ago",
      statusLabel: "Completed",
      statusTone: "success",
    },
    {
      id: "activity-overdue",
      title: "Overdue notices escalated",
      description:
        "Critical member accounts were flagged for same-day follow-up before the evening close.",
      actor: "Maya Sayegh",
      actorRole: "Membership support",
      meta: "28 minutes ago",
      statusLabel: "Needs review",
      statusTone: "warning",
    },
    {
      id: "activity-catalog",
      title: "Catalog fee update published",
      description:
        "Borrow fees were updated for two science titles after inventory transfer confirmation.",
      actor: "Jad Khoury",
      actorRole: "Catalog manager",
      meta: "1 hour ago",
      statusLabel: "Published",
      statusTone: "info",
    },
    {
      id: "activity-user",
      title: "Member access restored",
      description:
        "A suspended borrower returned all overdue material and regained borrowing access.",
      actor: "Lina Saad",
      actorRole: "User services",
      meta: "1 hour ago",
      statusLabel: "Resolved",
      statusTone: "success",
    },
  ];

export const adminDashboardQuickActions: ReadonlyArray<AdminDashboardQuickAction> =
  [
    {
      id: "quick-books",
      title: "Books",
      description:
        "Review catalog records, borrowing fees, and high-demand availability changes.",
      actionLabel: "Open books",
      href: "/admin/books",
      icon: BookCopy,
    },
    {
      id: "quick-inventory",
      title: "Inventory",
      description:
        "Check shelf depth, transfer pressure, and low-stock alerts before peak pickup hours.",
      actionLabel: "Open inventory",
      href: "/admin/inventory",
      icon: PackageOpen,
    },
    {
      id: "quick-users",
      title: "Users",
      description:
        "Handle member follow-up, payment review, and account health in one place.",
      actionLabel: "Open users",
      href: "/admin/users",
      icon: Users,
    },
  ];
