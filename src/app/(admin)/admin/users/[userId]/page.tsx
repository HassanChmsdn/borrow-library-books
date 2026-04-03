import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AdminDetailSection,
  AdminPageHeader,
  AdminSectionCard,
  AdminUserAvatar,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { getAdminUserRecordById, adminUserRecords } from "@/modules/admin-users/mock-data";
import {
  UserRoleBadge,
  UserStatusBadge,
} from "@/modules/admin-users/components";

type AdminUserProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export async function generateMetadata(props: AdminUserProfilePageProps) {
  const { userId } = await props.params;
  const user = getAdminUserRecordById(userId);

  return {
    title: user ? `${user.fullName} | Admin Users` : "Admin User Profile",
  };
}

export function generateStaticParams() {
  return adminUserRecords.map((user) => ({ userId: user.id }));
}

export default async function AdminUserProfilePage(
  props: AdminUserProfilePageProps,
) {
  const { userId } = await props.params;
  const user = getAdminUserRecordById(userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Members"
        title={user.fullName}
        description="This route is ready for future user profile management integration and currently renders from typed mock user data."
        controls={
          <div className="flex flex-wrap items-center gap-2">
            <UserRoleBadge role={user.role} />
            <UserStatusBadge status={user.status} />
          </div>
        }
      />

      <AdminSectionCard
        title="Member profile route"
        description="Use this placeholder route as the target for future account management flows, policy controls, and borrowing reviews."
        actions={
          <Button asChild type="button" size="sm" variant="outline">
            <Link href="/admin/users">Back to users</Link>
          </Button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start">
          <AdminUserAvatar
            className="rounded-card border-border-subtle bg-muted border p-4"
            name={user.fullName}
            subtitle={user.email}
          />
          <AdminDetailSection
            items={[
              { label: "Role", value: <UserRoleBadge role={user.role} /> },
              {
                label: "Account status",
                value: <UserStatusBadge status={user.status} />,
              },
              { label: "Joined", value: user.joinedDateLabel },
              { label: "Borrowing", value: user.borrowingSummaryLabel },
              { label: "Notes", value: user.borrowingSummaryMeta },
            ]}
          />
        </div>
      </AdminSectionCard>
    </div>
  );
}