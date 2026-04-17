import { AdminFinancialModule, getAdminFinancialModuleData } from "@/modules/admin-financial";
import { requireAuthorizedRoute } from "@/lib/auth/server";

export const metadata = {
  title: "Admin Financial",
};

export default async function AdminFinancialPage() {
  await requireAuthorizedRoute("/admin/financial");
  const data = await getAdminFinancialModuleData();

  return <AdminFinancialModule data={data} />;
}