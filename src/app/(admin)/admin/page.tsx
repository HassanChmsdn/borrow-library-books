import { AdminDashboardModule } from "@/modules/admin-dashboard";
import { getAdminDashboardModuleData } from "@/modules/admin-dashboard/server";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminShellPreviewPage() {
  const data = await getAdminDashboardModuleData();

  return <AdminDashboardModule data={data} />;
}
