import { AdminDashboardModule } from "@/modules/admin-dashboard";

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminShellPreviewPage() {
  return <AdminDashboardModule />;
}
