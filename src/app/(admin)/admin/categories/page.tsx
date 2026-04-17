import { AdminCategoriesModule } from "@/modules/admin-categories";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import { listAdminCategoryRecords } from "@/modules/admin-categories/server";

export const metadata = {
  title: "Admin Categories",
};

export default async function AdminCategoriesPage() {
  await requireAuthorizedRoute("/admin/categories");
  const initialRecords = await listAdminCategoryRecords();

  return <AdminCategoriesModule initialRecords={initialRecords} />;
}
