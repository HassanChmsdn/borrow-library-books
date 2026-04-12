import { AdminUsersModule } from "@/modules/admin-users";
import { listAdminUserRecords } from "@/modules/admin-users/server";

export const metadata = {
  title: "Admin Users",
};

export default async function AdminUsersPage() {
  const records = await listAdminUserRecords();

  return <AdminUsersModule records={records} />;
}
