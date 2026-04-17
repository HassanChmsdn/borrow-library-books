import { AdminBorrowingsModule } from "@/modules/admin-borrowings";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import { listAdminBorrowingRecords } from "@/modules/admin-borrowings/server";

export const metadata = {
  title: "Admin Borrowings",
};

export default async function AdminBorrowingsPage() {
  await requireAuthorizedRoute("/admin/borrowings");
  const records = await listAdminBorrowingRecords();

  return <AdminBorrowingsModule records={records} />;
}
