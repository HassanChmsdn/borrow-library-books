import "server-only";

import type { MockAuthUser } from "@/lib/auth";
import {
  listBookCopyRecordsFromStore,
  listBorrowRequestRecordsFromStore,
} from "@/lib/data/server";
import { formatAdminActivityMeta, formatAdminJoinedDate } from "@/modules/admin-shared/mock-data";

import type { AdminProfileRecord } from "./types";

export async function createAdminProfileRecord(currentUser: MockAuthUser): Promise<AdminProfileRecord> {
  const [borrowings, copies] = await Promise.all([
    listBorrowRequestRecordsFromStore(),
    listBookCopyRecordsFromStore(),
  ]);
  const joinedOn = new Date().toISOString();

  return {
    accountSummaryNote:
      "This admin profile reflects the current application user, live borrowing pressure, and copy maintenance state from the active data store.",
    detailItems: [
      { label: "Email", value: currentUser.email },
      { label: "Joined", value: formatAdminJoinedDate(joinedOn).replace("Joined ", "") },
      { label: "Role", value: "Administrator" },
      { label: "Account status", value: "Active" },
      { label: "Primary workspace", value: "Admin operations workspace" },
      { label: "Managed areas", value: "Catalog, borrowings, users" },
      {
        label: "Auth mode",
        value: currentUser.authSource === "auth0" ? "Auth0 identity" : "Mocked admin access",
      },
    ],
    email: currentUser.email,
    fullName: currentUser.fullName,
    id: currentUser.id,
    joinedDateLabel: formatAdminJoinedDate(joinedOn),
    metrics: [
      {
        label: "Pending requests",
        supportingText: "Current pickup approvals and assignment requests waiting for staff action.",
        value: String(borrowings.filter((record) => record.status === "pending").length),
      },
      {
        label: "Overdue follow-up",
        supportingText: "Accounts that still need circulation follow-up before they can be cleared.",
        value: String(borrowings.filter((record) => record.status === "overdue").length),
      },
      {
        label: "Maintenance copies",
        supportingText: "Physical copies currently held back from circulation for repair or review.",
        value: String(copies.filter((record) => record.status === "maintenance").length),
      },
    ],
    recentActivity: borrowings.slice(0, 4).map((record) => ({
      description: `${record.customDuration ? "Custom-duration" : "Standard"} request at ${record.branch}.`,
      id: record.id,
      occurredLabel: formatAdminActivityMeta(record.requestedOn),
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
    })),
    role: "admin",
    status: "active",
    subtitle: currentUser.subtitle,
  };
}