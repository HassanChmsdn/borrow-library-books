import { AdminInventoryModule } from "@/modules/admin-inventory";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import {
  listAdminInventoryBookOptions,
  listAdminInventoryRecords,
} from "@/modules/admin-inventory/server";

export const metadata = {
  title: "Admin Inventory",
};

export default async function AdminInventoryPage() {
  await requireAuthorizedRoute("/admin/inventory");
  const [records, bookOptions] = await Promise.all([
    listAdminInventoryRecords(),
    listAdminInventoryBookOptions(),
  ]);

  return <AdminInventoryModule bookOptions={bookOptions} records={records} />;
}
