import { AdminUsersModule } from "@/modules/admin-users";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import { listAdminUserRecords } from "@/modules/admin-users/server";

export const metadata = {
  title: "Admin Users",
};

export default async function AdminUsersPage() {
  await requireAuthorizedRoute("/admin/users");
  const records = await listAdminUserRecords();

  return <AdminUsersModule records={records} />;
}
