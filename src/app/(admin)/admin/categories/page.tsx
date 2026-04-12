import { AdminCategoriesModule } from "@/modules/admin-categories";
import { listAdminCategoryRecords } from "@/modules/admin-categories/server";

export const metadata = {
  title: "Admin Categories",
};

export default async function AdminCategoriesPage() {
  const initialRecords = await listAdminCategoryRecords();

  return <AdminCategoriesModule initialRecords={initialRecords} />;
}
