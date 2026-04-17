import {
  AdminUserProfileEmptyState,
  AdminUserProfileModule,
} from "@/modules/admin-users";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import {
  getAdminUserProfileRecordByIdFromStore,
  listAdminUserProfileRecords,
} from "@/modules/admin-users/server";

type AdminUserProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(props: AdminUserProfilePageProps) {
  const { id } = await props.params;
  const user = await getAdminUserProfileRecordByIdFromStore(id);

  return {
    title: user ? `${user.fullName} | Admin Users` : "Admin User Profile",
  };
}

export async function generateStaticParams() {
  const users = await listAdminUserProfileRecords();

  return users.map((user) => ({ id: user.id }));
}

export default async function AdminUserProfilePage(
  props: AdminUserProfilePageProps,
) {
  const { id } = await props.params;
  await requireAuthorizedRoute(`/admin/users/${id}`);
  const user = await getAdminUserProfileRecordByIdFromStore(id);

  if (!user) {
    return <AdminUserProfileEmptyState />;
  }

  return <AdminUserProfileModule key={user.id} initialUser={user} />;
}