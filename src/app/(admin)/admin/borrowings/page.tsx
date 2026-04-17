import { AdminBorrowingsModule } from "@/modules/admin-borrowings";
import { requireAdminSectionAccess } from "@/lib/auth/server";
import { listAdminBorrowingRecords } from "@/modules/admin-borrowings/server";

export const metadata = {
  title: "Admin Borrowings",
};

export default async function AdminBorrowingsPage() {
  await requireAdminSectionAccess("borrowings", "/admin/borrowings");
  const records = await listAdminBorrowingRecords();

  return <AdminBorrowingsModule records={records} />;
}
