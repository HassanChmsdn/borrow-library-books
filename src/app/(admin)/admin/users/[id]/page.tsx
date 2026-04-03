import {
  AdminUserProfileEmptyState,
  AdminUserProfileModule,
  adminUserProfileRecords,
  getAdminUserProfileRecordById,
} from "@/modules/admin-users";

type AdminUserProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(props: AdminUserProfilePageProps) {
  const { id } = await props.params;
  const user = getAdminUserProfileRecordById(id);

  return {
    title: user ? `${user.fullName} | Admin Users` : "Admin User Profile",
  };
}

export function generateStaticParams() {
  return adminUserProfileRecords.map((user) => ({ id: user.id }));
}

export default async function AdminUserProfilePage(
  props: AdminUserProfilePageProps,
) {
  const { id } = await props.params;
  const user = getAdminUserProfileRecordById(id);

  if (!user) {
    return <AdminUserProfileEmptyState />;
  }

  return <AdminUserProfileModule key={user.id} initialUser={user} />;
}