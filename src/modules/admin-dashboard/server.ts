import "server-only";

import {
  BookCopy,
  Clock3,
  HandCoins,
  PackageOpen,
  TriangleAlert,
  Users,
} from "lucide-react";

import {
  canAccessAdminSection,
  getAdminSectionFromPathname,
  type AppAuthState,
} from "@/lib/auth";
import {
  listBookCopyRecordsFromStore,
  listBorrowRequestRecordsFromStore,
  listVisibleUserRecordsFromStore,
} from "@/lib/data/server";
import {
  formatAdminActivityMeta,
  formatAdminCurrency,
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

function canOpenAdminHref(session: AppAuthState | undefined, href: string) {
  if (!session) {
    return true;
  }

  const section = getAdminSectionFromPathname(href);

  return !section || canAccessAdminSection(session, section);
}

export async function getAdminDashboardModuleData(session?: AppAuthState) {
  const [borrowings, copies, users] = await Promise.all([
    listBorrowRequestRecordsFromStore(),
    listBookCopyRecordsFromStore(),
    listVisibleUserRecordsFromStore(),
  ]);
  const now = new Date();
  const pendingCount = borrowings.filter((record) => record.status === "pending").length;
  const activeCount = borrowings.filter(
    (record) => record.status === "active" || record.status === "overdue",
  ).length;
  const overdueCount = borrowings.filter((record) => record.status === "overdue").length;
  const settledRecords = borrowings.filter((record) => record.paymentStatus === "cash-settled");
  const activeUserIds = new Set(
    borrowings
      .filter((record) => {
        const timestamps = [record.requestedOn, record.startedOn, record.returnedOn].filter(Boolean) as string[];

        return timestamps.some(
          (timestamp) => now.getTime() - new Date(timestamp).getTime() <= 30 * oneDayInMs,
        );
      })
      .map((record) => record.userId),
  );
  const pendingCustomReviewCount = borrowings.filter(
    (record) => record.status === "pending" && record.customDuration,
  ).length;
  const overdueCashCount = borrowings.filter(
    (record) => record.status === "overdue" && record.paymentStatus === "cash-due",
  ).length;
  const maintenanceCount = copies.filter((copy) => copy.status === "maintenance").length;
  const cashRevenueCents = settledRecords.reduce((total, record) => total + record.feeCents, 0);

  const metrics: ReadonlyArray<AdminDashboardMetric> = [
    {
      id: "pending",
      icon: Clock3,
      label: "Pending requests",
      supportingText: "Pickup approvals and custom-duration reviews currently waiting for staff confirmation.",
      tone: "warning",
      trend: `${pendingCustomReviewCount} custom review`,
      value: String(pendingCount),
    },
    {
      id: "active",
      icon: BookCopy,
      label: "Active loans",
      supportingText: "Borrowings currently out across branches, including overdue material that still needs to return.",
      tone: "info",
      trend: `${borrowings.filter((record) => record.status === "active").length} on track`,
      value: String(activeCount),
    },
    {
      id: "overdue",
      icon: TriangleAlert,
      label: "Overdue follow-up",
      supportingText: "Accounts requiring same-day follow-up before circulation closes for the shift.",
      tone: "danger",
      trend: `${overdueCashCount} need cash review`,
      value: String(overdueCount),
    },
    {
      id: "revenue",
      icon: HandCoins,
      label: "Cash revenue",
      supportingText: "Onsite cash fees already settled in the current circulation history.",
      tone: "success",
      trend: `${settledRecords.length} settled records`,
      value: formatAdminCurrency(cashRevenueCents),
    },
    {
      id: "users",
      icon: Users,
      label: "Active users",
      supportingText: "Members with borrowing activity in the last 30 days across requests, loans, and returns.",
      tone: "info",
      trend: `${users.filter((user) => user.role === "member").length} member accounts`,
      value: String(activeUserIds.size),
    },
  ];

  const notices = [
    {
      actionHref: "/admin/borrowings",
      actionLabel: "Open borrowings",
      badgeLabel: "Pending",
      countLabel: `${pendingCount} open items`,
      description: "Pickup approvals and custom-duration requests are waiting in the staff review queue.",
      id: "notice-pending-requests",
      meta: `${pendingCustomReviewCount} custom-duration request${pendingCustomReviewCount === 1 ? "" : "s"} need manual review.`,
      title: "Pending requests",
      tone: "warning",
    },
    {
      actionHref: "/admin/users",
      actionLabel: "Review users",
      badgeLabel: "Overdue",
      countLabel: `${overdueCount} overdue cases`,
      description: "Several readers passed their due windows and need coordinated account follow-up before close.",
      id: "notice-overdue-follow-up",
      meta: `${overdueCashCount} account${overdueCashCount === 1 ? " still owes" : "s still owe"} onsite cash.`,
      title: "Overdue follow-up",
      tone: "danger",
    },
  ] satisfies ReadonlyArray<AdminDashboardNoticeItem>;
  const visibleNotices = notices.filter((notice) =>
    canOpenAdminHref(session, notice.actionHref),
  );

  const trendPoints: ReadonlyArray<AdminDashboardTrendPoint> = Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(now.getTime() - (6 - index) * oneDayInMs);
    const dateKey = currentDate.toISOString().slice(0, 10);

    return {
      borrowings: borrowings.filter((record) => {
        const timestamp = record.startedOn ?? record.requestedOn;
        return timestamp.slice(0, 10) === dateKey;
      }).length,
      id: dateKey,
      label: getAdminSharedWeekdayLabel(currentDate.toISOString()),
      overdue: borrowings.filter((record) => {
        if (record.status !== "overdue" || !record.startedOn) {
          return false;
        }

        const dueDateKey = new Date(
          new Date(record.startedOn).getTime() + record.durationDays * oneDayInMs,
        )
          .toISOString()
          .slice(0, 10);

        return dueDateKey === dateKey;
      }).length,
      returns: borrowings.filter((record) => record.returnedOn?.slice(0, 10) === dateKey).length,
    };
  });
  const returnedBorrowings = borrowings.filter((record) => record.status === "returned");
  const returnedOnTimeCount = returnedBorrowings.filter((record) => {
    if (!record.startedOn || !record.returnedOn) {
      return false;
    }

    const dueTime = new Date(record.startedOn).getTime() + record.durationDays * oneDayInMs;
    return new Date(record.returnedOn).getTime() <= dueTime;
  }).length;
  const sevenDayBorrowings = trendPoints.reduce((total, point) => total + point.borrowings, 0);

  const trendSummary: ReadonlyArray<AdminDashboardTrendSummaryItem> = [
    {
      hint: `Average of ${(sevenDayBorrowings / 7).toFixed(1)} borrowings started or requested per day.`,
      id: "seven-day-borrows",
      label: "7-day borrowings",
      value: `${sevenDayBorrowings} loans`,
    },
    {
      hint: "Derived from current return history against scheduled due dates.",
      id: "return-rate",
      label: "On-time return rate",
      statusLabel: returnedOnTimeCount === returnedBorrowings.length ? "Healthy" : "Watch",
      statusTone: returnedOnTimeCount === returnedBorrowings.length ? "success" : "warning",
      value: `${Math.round((returnedOnTimeCount / Math.max(returnedBorrowings.length, 1)) * 100)}%`,
    },
    {
      hint: maintenanceCount > 0 ? `${maintenanceCount} copies currently held for maintenance.` : "No copies are currently held for maintenance.",
      id: "cash-settled",
      label: "Cash settled onsite",
      statusLabel: "Onsite only",
      statusTone: "warning",
      value: formatAdminCurrency(cashRevenueCents),
    },
  ];

  const activity: ReadonlyArray<AdminDashboardActivityItem> = borrowings.slice(0, 5).map((record) => ({
    actor: users.find((user) => user.id === record.userId)?.fullName ?? "Library member",
    actorRole: "Member account",
    description: `${record.customDuration ? "Custom-duration" : "Standard"} request for ${record.durationDays} days at ${record.branch}.`,
    id: record.id,
    meta: formatAdminActivityMeta(record.requestedOn),
    statusLabel:
      record.status === "pending"
        ? "Pending"
        : record.status === "overdue"
          ? "Overdue"
          : record.status === "returned"
            ? "Returned"
            : "Active",
    statusTone:
      record.status === "pending"
        ? "warning"
        : record.status === "overdue"
          ? "danger"
          : record.status === "returned"
            ? "neutral"
            : "success",
    title: "Borrowing activity",
  }));

  const quickActions = [
    {
      actionLabel: "Open books",
      description: "Review catalog records, borrowing fees, and availability changes.",
      href: "/admin/books",
      icon: BookCopy,
      id: "quick-books",
      title: "Books",
    },
    {
      actionLabel: "Open inventory",
      description: "Check shelf depth, transfer pressure, and copy maintenance before peak pickup hours.",
      href: "/admin/inventory",
      icon: PackageOpen,
      id: "quick-inventory",
      title: "Inventory",
    },
    {
      actionLabel: "Open users",
      description: "Handle member follow-up, payment review, and account health in one place.",
      href: "/admin/users",
      icon: Users,
      id: "quick-users",
      title: "Users",
    },
  ] satisfies ReadonlyArray<AdminDashboardQuickAction>;
  const visibleQuickActions = quickActions.filter((action) =>
    canOpenAdminHref(session, action.href),
  );

  return {
    activity,
    availableSections: {
      books: canOpenAdminHref(session, "/admin/books"),
      borrowings: canOpenAdminHref(session, "/admin/borrowings"),
      inventory: canOpenAdminHref(session, "/admin/inventory"),
    },
    metrics,
    notices: visibleNotices,
    quickActions: visibleQuickActions,
    trendPoints,
    trendSummary,
  };
}