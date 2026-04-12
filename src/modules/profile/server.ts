import "server-only";

import { getStoredUserRecordById, listStoredBorrowRequestRecordsForUser } from "@/lib/data/server";

import type {
  ProfileAccountDetail,
  ProfileData,
  ProfileSettingsSection,
  ProfileSummaryMetric,
} from "./data";

function formatCashAmount(cents: number) {
  if (cents === 0) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    minimumFractionDigits: 2,
    style: "currency",
  }).format(cents / 100);
}

function createInitials(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function buildSettingsSections(): ReadonlyArray<ProfileSettingsSection> {
  return [
    {
      description: "Keep reminders concise and mobile-friendly across email and text messages.",
      items: [
        {
          actionLabel: "Edit reminders",
          description: "Sent two days before a book is due and again the morning of the due date.",
          title: "Due date reminders",
          value: "Email and SMS",
        },
        {
          actionLabel: "Update alerts",
          description: "Triggered when a reserved title is ready at the desk or its hold window is about to expire.",
          title: "Pickup alerts",
          value: "Enabled",
        },
      ],
      title: "Notifications",
    },
    {
      description: "Desk and duration preferences stay visible here before any real account editing is connected.",
      items: [
        {
          actionLabel: "Change branch",
          description: "New reservations are routed to the member's preferred branch by default.",
          title: "Default pickup branch",
          value: "Main library desk",
        },
        {
          actionLabel: "View policy",
          description: "Staff review is required for requests longer than the standard borrowing window.",
          title: "Custom duration requests",
          value: "Request at checkout",
        },
      ],
      title: "Borrowing preferences",
    },
    {
      description: "A clean placeholder for the future self-service settings flow.",
      items: [
        {
          actionLabel: "Security info",
          description: "Identity is currently managed through the authentication provider and staff-assisted workflows.",
          title: "Password and sign-in",
          value: "Managed account",
        },
      ],
      title: "Account security",
    },
  ];
}

export async function getProfileDataForUser(userId: string): Promise<ProfileData | null> {
  const [user, borrowings] = await Promise.all([
    getStoredUserRecordById(userId),
    listStoredBorrowRequestRecordsForUser(userId),
  ]);

  if (!user) {
    return null;
  }

  const activeLoans = borrowings.filter((record) => record.status === "active").length;
  const pendingPickups = borrowings.filter((record) => record.status === "pending").length;
  const overdueItems = borrowings.filter((record) => record.status === "overdue").length;
  const cashDueCents = borrowings.reduce((sum, record) => {
    if (record.paymentStatus === "cash-due") {
      return sum + record.feeCents;
    }

    return sum;
  }, 0);

  const accountDetails: ReadonlyArray<ProfileAccountDetail> = [
    { label: "Library card", value: user.id.slice(-8).toUpperCase() },
    {
      label: "Member since",
      value: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
        new Date(user.joinedOn),
      ),
    },
    { label: "Preferred pickup branch", value: "Main library desk" },
    { label: "Membership tier", value: user.membershipLabel },
    { label: "Borrowing window", value: "14 days standard" },
    { label: "Payment policy", value: "Onsite cash payment only" },
  ];

  const summaryMetrics: ReadonlyArray<ProfileSummaryMetric> = [
    {
      key: "active-loans",
      label: "Active loans",
      supportingText: "Titles currently checked out on the member account.",
      value: String(activeLoans),
    },
    {
      key: "pending-pickups",
      label: "Pending pickups",
      supportingText: "Reserved books waiting at the library desk.",
      value: String(pendingPickups),
    },
    {
      key: "overdue-items",
      label: "Overdue items",
      supportingText: "Loans that need attention before the next visit.",
      value: String(overdueItems),
    },
    {
      key: "cash-due",
      label: "Onsite cash due",
      supportingText: "Fees collected onsite only when the member visits.",
      value: formatCashAmount(cashDueCents),
    },
  ];

  return {
    accountDetails,
    accountStatusLabel: user.status === "active" ? "Active member" : "Suspended account",
    person: {
      bio: user.profileNote,
      email: user.email,
      fullName: user.fullName,
      initials: createInitials(user.fullName),
      location: "Main library membership",
      phone: "Staff assisted",
    },
    settingsSections: buildSettingsSections(),
    summaryMetrics,
  };
}