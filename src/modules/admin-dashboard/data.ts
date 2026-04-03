import {
  BookCopy,
  Clock3,
  HandCoins,
  PackageOpen,
  TriangleAlert,
  Users,
} from "lucide-react";

import {
  adminSharedActivities,
  adminSharedBorrowings,
  adminSharedNow,
  adminSharedUsers,
  formatAdminActivityMeta,
  formatAdminCurrency,
  getAdminSharedUser,
  getAdminSharedWeekdayLabel,
} from "@/modules/admin-shared/mock-data";

import type {
  AdminDashboardActivityItem,
  AdminDashboardMetric,
  AdminDashboardNoticeItem,
  AdminDashboardQuickAction,
  AdminDashboardTrendPoint,
  AdminDashboardTrendSummaryItem,
} from "./types";

const oneDayInMs = 24 * 60 * 60 * 1000;

function countBorrowingsByStatus(status: (typeof adminSharedBorrowings)[number]["status"]) {
  return adminSharedBorrowings.filter((record) => record.status === status).length;
}

function getActiveLoanCount() {
  return adminSharedBorrowings.filter(
    (record) => record.status === "active" || record.status === "overdue",
  ).length;
}

function getActiveUsersCount() {
  const threshold = adminSharedNow.getTime() - 30 * oneDayInMs;
  const activeUserIds = new Set(
    adminSharedBorrowings
      .filter((record) => {
        const timestamps = [record.requestedOn, record.startedOn, record.returnedOn].filter(
          Boolean,
        ) as string[];

        return timestamps.some((timestamp) => new Date(timestamp).getTime() >= threshold);
      })
      .map((record) => record.userId),
  );

  return activeUserIds.size;
}

function getCashRevenueCents() {
  return adminSharedBorrowings
    .filter((record) => record.paymentStatus === "cash-settled")
    .reduce((total, record) => total + record.feeCents, 0);
}

const pendingCount = countBorrowingsByStatus("pending");
const overdueCount = countBorrowingsByStatus("overdue");
const pendingCustomReviewCount = adminSharedBorrowings.filter(
  (record) => record.status === "pending" && record.customDuration,
).length;
const overdueCashCount = adminSharedBorrowings.filter(
  (record) => record.status === "overdue" && record.paymentStatus === "cash-due",
).length;

export const adminDashboardMetrics: ReadonlyArray<AdminDashboardMetric> = [
  {
    id: "pending",
    label: "Pending requests",
    value: String(pendingCount),
    supportingText: "Pickup approvals and custom-duration reviews currently waiting for staff confirmation.",
    icon: Clock3,
    trend: `${pendingCustomReviewCount} custom review`,
    tone: "warning",
  },
  {
    id: "active",
    label: "Active loans",
    value: String(getActiveLoanCount()),
    supportingText: "Borrowings currently out across branches, including overdue material that still needs to return.",
    icon: BookCopy,
    trend: `${countBorrowingsByStatus("active")} on track`,
    tone: "info",
  },
  {
    id: "overdue",
    label: "Overdue follow-up",
    value: String(overdueCount),
    supportingText: "Accounts requiring same-day follow-up before circulation closes for the shift.",
    icon: TriangleAlert,
    trend: `${overdueCashCount} need cash review`,
    tone: "danger",
  },
  {
    id: "revenue",
    label: "Cash revenue",
    value: formatAdminCurrency(getCashRevenueCents()),
    supportingText: "Onsite cash fees already settled in the current mock circulation history.",
    icon: HandCoins,
    trend: `${adminSharedBorrowings.filter((record) => record.paymentStatus === "cash-settled").length} settled records`,
    tone: "success",
  },
  {
    id: "users",
    label: "Active users",
    value: String(getActiveUsersCount()),
    supportingText: "Members with borrowing activity in the last 30 days across requests, loans, and returns.",
    icon: Users,
    trend: `${adminSharedUsers.filter((user) => user.role === "user").length} member accounts`,
    tone: "info",
  },
];

export const adminDashboardNotices: ReadonlyArray<AdminDashboardNoticeItem> = [
  {
    id: "notice-pending-requests",
    title: "Pending requests",
    badgeLabel: "Pending",
    description:
      "Pickup approvals and custom-duration requests are waiting in the staff review queue.",
    meta: `${pendingCustomReviewCount} custom-duration request${pendingCustomReviewCount === 1 ? "" : "s"} need manual review.`,
    countLabel: `${pendingCount} open items`,
    actionLabel: "Open borrowings",
    actionHref: "/admin/borrowings",
    tone: "warning",
  },
  {
    id: "notice-overdue-follow-up",
    title: "Overdue follow-up",
    badgeLabel: "Overdue",
    description:
      "Several readers passed their due windows and need coordinated account follow-up before close.",
    meta: `${overdueCashCount} account${overdueCashCount === 1 ? " still owes" : "s still owe"} onsite cash.`,
    countLabel: `${overdueCount} overdue cases`,
    actionLabel: "Review users",
    actionHref: "/admin/users",
    tone: "danger",
  },
];

function getTrendPointValue(dateKey: string, kind: "borrowings" | "returns" | "overdue") {
  if (kind === "borrowings") {
    return adminSharedBorrowings.filter((record) => {
      const timestamp = record.startedOn ?? record.requestedOn;
      return timestamp.slice(0, 10) === dateKey;
    }).length;
  }

  if (kind === "returns") {
    return adminSharedBorrowings.filter(
      (record) => record.returnedOn?.slice(0, 10) === dateKey,
    ).length;
  }

  return adminSharedBorrowings.filter((record) => {
    if (record.status !== "overdue" || !record.startedOn) {
      return false;
    }

    const dueDateKey = new Date(
      new Date(record.startedOn).getTime() + record.durationDays * oneDayInMs,
    )
      .toISOString()
      .slice(0, 10);

    return dueDateKey === dateKey;
  }).length;
}

export const adminDashboardTrendPoints: ReadonlyArray<AdminDashboardTrendPoint> =
  Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(adminSharedNow.getTime() - (6 - index) * oneDayInMs);
    const dateKey = currentDate.toISOString().slice(0, 10);

    return {
      id: dateKey,
      label: getAdminSharedWeekdayLabel(currentDate.toISOString()),
      borrowings: getTrendPointValue(dateKey, "borrowings"),
      returns: getTrendPointValue(dateKey, "returns"),
      overdue: getTrendPointValue(dateKey, "overdue"),
    };
  });

const returnedBorrowings = adminSharedBorrowings.filter((record) => record.status === "returned");
const returnedOnTimeCount = returnedBorrowings.filter((record) => {
  if (!record.startedOn || !record.returnedOn) {
    return false;
  }

  const dueTime = new Date(record.startedOn).getTime() + record.durationDays * oneDayInMs;
  return new Date(record.returnedOn).getTime() <= dueTime;
}).length;

const sevenDayBorrowings = adminDashboardTrendPoints.reduce(
  (total, point) => total + point.borrowings,
  0,
);

export const adminDashboardTrendSummary: ReadonlyArray<AdminDashboardTrendSummaryItem> = [
  {
    id: "seven-day-borrows",
    label: "7-day borrowings",
    value: `${sevenDayBorrowings} loans`,
    hint: `Average of ${(sevenDayBorrowings / 7).toFixed(1)} borrowings started or requested per day.`,
  },
  {
    id: "return-rate",
    label: "On-time return rate",
    value: `${Math.round((returnedOnTimeCount / Math.max(returnedBorrowings.length, 1)) * 100)}%`,
    hint: "Derived from current mock return history against scheduled due dates.",
    statusLabel: returnedOnTimeCount === returnedBorrowings.length ? "Healthy" : "Watch",
    statusTone: returnedOnTimeCount === returnedBorrowings.length ? "success" : "warning",
  },
  {
    id: "cash-settled",
    label: "Cash settled onsite",
    value: formatAdminCurrency(getCashRevenueCents()),
    hint: "All fee collection remains desk-based cash only in the current mock workflow.",
    statusLabel: "Onsite only",
    statusTone: "warning",
  },
];

export const adminDashboardActivity: ReadonlyArray<AdminDashboardActivityItem> =
  adminSharedActivities.map((activity) => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    actor: getAdminSharedUser(activity.actorUserId)?.fullName ?? "Unknown staff",
    actorRole: activity.actorRoleLabel,
    meta: formatAdminActivityMeta(activity.occurredOn),
    statusLabel: activity.statusLabel,
    statusTone: activity.statusTone,
  }));

export const adminDashboardQuickActions: ReadonlyArray<AdminDashboardQuickAction> = [
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
      "Check shelf depth, transfer pressure, and copy maintenance before peak pickup hours.",
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