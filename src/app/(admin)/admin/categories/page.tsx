import { AdminCategoriesModule } from "@/modules/admin-categories";
import { requireAdminSectionAccess } from "@/lib/auth/server";
import { listAdminCategoryRecords } from "@/modules/admin-categories/server";

export const metadata = {
  title: "Admin Categories",
};

export default async function AdminCategoriesPage() {
  await requireAdminSectionAccess("categories", "/admin/categories");
  const initialRecords = await listAdminCategoryRecords();

  return <AdminCategoriesModule initialRecords={initialRecords} />;
}
