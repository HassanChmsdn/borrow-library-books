import {
  AdminUserProfileEmptyState,
  AdminUserProfileModule,
  adminUserProfileRecords,
  getAdminUserProfileRecordById,
} from "@/modules/admin-users";

type AdminUserProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export async function generateMetadata(props: AdminUserProfilePageProps) {
  const { userId } = await props.params;
  const user = getAdminUserProfileRecordById(userId);

  return {
    title: user ? `${user.fullName} | Admin Users` : "Admin User Profile",
  };
}

export function generateStaticParams() {
  return adminUserProfileRecords.map((user) => ({ userId: user.id }));
}

export default async function AdminUserProfilePage(
  props: AdminUserProfilePageProps,
) {
  const { userId } = await props.params;
  const user = getAdminUserProfileRecordById(userId);

  if (!user) {
    return <AdminUserProfileEmptyState />;
  }

  return <AdminUserProfileModule key={user.id} initialUser={user} />;
}