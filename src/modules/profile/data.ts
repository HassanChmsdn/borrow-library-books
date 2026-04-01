import { myBorrowingsRecords } from "@/modules/borrowings";

type ProfileSummaryMetricKey =
  | "active-loans"
  | "pending-pickups"
  | "overdue-items"
  | "cash-due";

interface ProfilePerson {
  fullName: string;
  initials: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
}

interface ProfileAccountDetail {
  label: string;
  value: string;
}

interface ProfileSummaryMetric {
  key: ProfileSummaryMetricKey;
  label: string;
  supportingText: string;
  value: string;
}

interface ProfileSettingItem {
  title: string;
  description: string;
  value: string;
  actionLabel: string;
}

interface ProfileSettingsSection {
  title: string;
  description: string;
  items: ReadonlyArray<ProfileSettingItem>;
}

interface ProfileData {
  person: ProfilePerson;
  accountStatusLabel: string;
  accountDetails: ReadonlyArray<ProfileAccountDetail>;
  summaryMetrics: ReadonlyArray<ProfileSummaryMetric>;
  settingsSections: ReadonlyArray<ProfileSettingsSection>;
}

function formatCashAmount(cents: number) {
  if (cents === 0) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function buildProfileSummaryMetrics(): ReadonlyArray<ProfileSummaryMetric> {
  const activeLoans = myBorrowingsRecords.filter(
    (record) => record.tab === "active",
  ).length;
  const pendingPickups = myBorrowingsRecords.filter(
    (record) => record.tab === "pending",
  ).length;
  const overdueItems = myBorrowingsRecords.filter(
    (record) => record.tab === "overdue",
  ).length;
  const cashDueCents = myBorrowingsRecords.reduce((sum, record) => {
    if (
      record.paymentStatus.tone === "warning" ||
      record.paymentStatus.tone === "danger"
    ) {
      return sum + record.book.feeCents;
    }

    return sum;
  }, 0);

  return [
    {
      key: "active-loans",
      label: "Active loans",
      value: String(activeLoans),
      supportingText: "Titles currently checked out on the member account.",
    },
    {
      key: "pending-pickups",
      label: "Pending pickups",
      value: String(pendingPickups),
      supportingText: "Reserved books waiting at the library desk.",
    },
    {
      key: "overdue-items",
      label: "Overdue items",
      value: String(overdueItems),
      supportingText: "Loans that need attention before the next visit.",
    },
    {
      key: "cash-due",
      label: "Onsite cash due",
      value: formatCashAmount(cashDueCents),
      supportingText: "Fees collected onsite only when the member visits.",
    },
  ];
}

const profileData: Readonly<ProfileData> = {
  person: {
    fullName: "Sofia Carter",
    initials: "SC",
    email: "sofia.carter@example.com",
    phone: "+1 (555) 014-2281",
    location: "Downtown Branch Member",
    bio: "A regular library visitor who borrows narrative nonfiction, design books, and short philosophical reads. The profile view is mock-data only for now, but it mirrors the member-facing account layout from the design system.",
  },
  accountStatusLabel: "Active member",
  accountDetails: [
    { label: "Library card", value: "BL-2038-4417" },
    { label: "Member since", value: "September 2022" },
    { label: "Preferred pickup branch", value: "Downtown Library Desk" },
    { label: "Membership tier", value: "Community access" },
    { label: "Borrowing window", value: "14 days standard" },
    { label: "Payment policy", value: "Onsite cash payment only" },
  ],
  summaryMetrics: buildProfileSummaryMetrics(),
  settingsSections: [
    {
      title: "Notifications",
      description:
        "Keep reminders concise and mobile-friendly across email and text messages.",
      items: [
        {
          title: "Due date reminders",
          description:
            "Sent two days before a book is due and again the morning of the due date.",
          value: "Email and SMS",
          actionLabel: "Edit reminders",
        },
        {
          title: "Pickup alerts",
          description:
            "Triggered when a reserved title is ready at the desk or its hold window is about to expire.",
          value: "Enabled",
          actionLabel: "Update alerts",
        },
      ],
    },
    {
      title: "Borrowing preferences",
      description:
        "Desk and duration preferences stay visible here before any real account editing is connected.",
      items: [
        {
          title: "Default pickup branch",
          description:
            "New reservations are routed to the member's preferred branch by default.",
          value: "Downtown Library Desk",
          actionLabel: "Change branch",
        },
        {
          title: "Custom duration requests",
          description:
            "Staff review is required for requests longer than the standard borrowing window.",
          value: "Request at checkout",
          actionLabel: "View policy",
        },
      ],
    },
    {
      title: "Account security",
      description:
        "A clean placeholder for the future self-service settings flow.",
      items: [
        {
          title: "Password and sign-in",
          description:
            "The account currently uses a staff-assisted sign-in flow during the mock design phase.",
          value: "Staff assisted",
          actionLabel: "Security info",
        },
      ],
    },
  ],
};

function getProfileData() {
  return profileData;
}

export {
  getProfileData,
  type ProfileAccountDetail,
  type ProfileData,
  type ProfilePerson,
  type ProfileSettingItem,
  type ProfileSettingsSection,
  type ProfileSummaryMetric,
  type ProfileSummaryMetricKey,
};
