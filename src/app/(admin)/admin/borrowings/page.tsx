import { AdminBorrowingsModule } from "@/modules/admin-borrowings";
import { listAdminBorrowingRecords } from "@/modules/admin-borrowings/server";

export const metadata = {
  title: "Admin Borrowings",
};

export default async function AdminBorrowingsPage() {
  const records = await listAdminBorrowingRecords();

  return <AdminBorrowingsModule records={records} />;
}
