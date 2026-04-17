import { AdminDashboardModule } from "@/modules/admin-dashboard";
import { requireAdminSession } from "@/lib/auth/server";
import { getAdminDashboardModuleData } from "@/modules/admin-dashboard/server";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminShellPreviewPage() {
  const session = await requireAdminSession("/admin");
  const data = await getAdminDashboardModuleData(session);

  return <AdminDashboardModule data={data} />;
}
