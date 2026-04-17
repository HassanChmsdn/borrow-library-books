import { AdminDashboardModule } from "@/modules/admin-dashboard";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import { getAdminDashboardModuleData } from "@/modules/admin-dashboard/server";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminShellPreviewPage() {
  const session = await requireAuthorizedRoute("/admin");
  const data = await getAdminDashboardModuleData(session);

  return <AdminDashboardModule data={data} />;
}
