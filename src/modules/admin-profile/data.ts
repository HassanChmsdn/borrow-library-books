import type { MockAuthUser } from "@/lib/auth/mock-auth";
import {
  adminSharedActivities,
  adminSharedBorrowings,
  adminSharedInventoryCopies,
  formatAdminActivityMeta,
  formatAdminJoinedDate,
} from "@/modules/admin-shared/mock-data";

import type { AdminProfileRecord } from "./types";

const adminProfileSeeds: Record<
  string,
  {
    accountSummaryNote: string;
    focusAreas: ReadonlyArray<string>;
    joinedOn: string;
    primaryWorkspace: string;
  }
> = {
  "admin-samir-chahine": {
    joinedOn: "2024-08-12T00:00:00.000Z",
    primaryWorkspace: "Circulation and catalog operations",
    focusAreas: ["Borrowings approvals", "Catalog quality", "Member follow-up"],
    accountSummaryNote:
      "This mocked admin profile is scoped for future Auth0 claims and Mongo-backed staff preferences, while still surfacing the current workspace posture in a realistic way.",
  },
};

function getPendingBorrowingsCount() {
  return adminSharedBorrowings.filter((record) => record.status === "pending").length;
}

function getOverdueBorrowingsCount() {
  return adminSharedBorrowings.filter((record) => record.status === "overdue").length;
}

function getMaintenanceCopiesCount() {
  return adminSharedInventoryCopies.filter((copy) => copy.status === "maintenance").length;
}

export function createAdminProfileRecord(currentUser: MockAuthUser): AdminProfileRecord {
  const seed =
    adminProfileSeeds[currentUser.id] ?? {
      joinedOn: "2024-01-01T00:00:00.000Z",
      primaryWorkspace: "Admin operations workspace",
      focusAreas: ["Catalog management", "Borrowings review"],
      accountSummaryNote:
        "Mocked admin profile data is active for this account and can later be replaced by Auth0 and Mongo-backed profile records.",
    };

  return {
    id: currentUser.id,
    fullName: currentUser.fullName,
    email: currentUser.email,
    role: "admin",
    status: "active",
    subtitle: currentUser.subtitle,
    joinedDateLabel: formatAdminJoinedDate(seed.joinedOn),
    accountSummaryNote: seed.accountSummaryNote,
    detailItems: [
      {
        label: "Email",
        value: currentUser.email,
      },
      {
        label: "Joined",
        value: formatAdminJoinedDate(seed.joinedOn).replace("Joined ", ""),
      },
      {
        label: "Role",
        value: "Administrator",
      },
      {
        label: "Account status",
        value: "Active",
      },
      {
        label: "Primary workspace",
        value: seed.primaryWorkspace,
      },
      {
        label: "Managed areas",
        value: seed.focusAreas.join(", "),
        hint: "Mocked scope for the current authenticated admin session.",
      },
      {
        label: "Auth mode",
        value: "Mocked admin access",
        hint: "Prepared to map later to Auth0 role claims and Mongo-backed staff records.",
      },
    ],
    metrics: [
      {
        label: "Pending requests",
        value: String(getPendingBorrowingsCount()),
        supportingText:
          "Current pickup approvals and assignment requests waiting for staff action.",
      },
      {
        label: "Overdue follow-up",
        value: String(getOverdueBorrowingsCount()),
        supportingText:
          "Accounts that still need circulation follow-up before they can be cleared.",
      },
      {
        label: "Maintenance copies",
        value: String(getMaintenanceCopiesCount()),
        supportingText:
          "Physical copies currently held back from circulation for repair or review.",
      },
    ],
    recentActivity: adminSharedActivities.slice(0, 4).map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      occurredLabel: formatAdminActivityMeta(activity.occurredOn),
      statusLabel: activity.statusLabel,
      statusTone: activity.statusTone,
    })),
  };
}