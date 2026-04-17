import {
  AdminDetailSection,
  AdminMetricStrip,
  AdminSectionCard,
  AdminUserAvatar,
} from "@/components/admin";
import { getAppRoleDisplayLabel, hasAdminAccessRole } from "@/lib/auth/roles";

import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";

import type { AdminUserProfileRecord } from "../types";

interface UserProfileSummaryProps {
  user: AdminUserProfileRecord;
}

function UserProfileSummary({ user }: Readonly<UserProfileSummaryProps>) {
  return (
    <AdminSectionCard
      title="Profile summary"
      description="Core account details and circulation posture for staff review."
    >
      <div className="grid gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <AdminUserAvatar
            name={user.fullName}
            subtitle={user.email}
            meta={
              hasAdminAccessRole(user.role)
                ? `${getAppRoleDisplayLabel(user.role)} account`
                : "Member account"
            }
          />
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <UserRoleBadge role={user.role} />
            <UserStatusBadge status={user.status} />
          </div>
        </div>

        <AdminDetailSection
          columns={2}
          className="sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"
          items={[
            {
              label: "Email",
              value: user.email,
            },
            {
              label: "Joined",
              value: user.joinedDateLabel,
            },
            {
              label: "Role",
              value: <UserRoleBadge role={user.role} />,
            },
            {
              label: "Account status",
              value: <UserStatusBadge status={user.status} />,
            },
            {
              label: "Borrowing overview",
              value: user.borrowingSummaryLabel,
              hint: user.borrowingSummaryMeta,
            },
          ]}
        />

        <AdminMetricStrip
          columnsClassName="sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3"
          items={[
            {
              label: "Total borrowings",
              value: String(user.totalBorrowingsCount),
              supportingText: "Historical completed and active circulation records.",
            },
            {
              label: "Active now",
              value: String(user.activeBorrowingsCount),
              supportingText: "Current active and pending circulation items on the account.",
            },
            {
              label: "Overdue",
              value: String(user.overdueCount),
              supportingText:
                user.overdueCount > 0
                  ? "Requires staff follow-up before the account is cleared."
                  : "No overdue exposure is currently recorded.",
            },
          ]}
        />

        <p className="text-body-sm text-text-secondary">{user.profileSummaryNote}</p>
      </div>
    </AdminSectionCard>
  );
}

export { UserProfileSummary, type UserProfileSummaryProps };