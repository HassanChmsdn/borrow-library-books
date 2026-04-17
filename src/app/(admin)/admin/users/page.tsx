import { AdminUsersModule } from "@/modules/admin-users";
import { requireAdminSectionAccess } from "@/lib/auth/server";
import { listAdminUserRecords } from "@/modules/admin-users/server";

export const metadata = {
  title: "Admin Users",
};

export default async function AdminUsersPage() {
  await requireAdminSectionAccess("users", "/admin/users");
  const records = await listAdminUserRecords();

  return <AdminUsersModule records={records} />;
}
