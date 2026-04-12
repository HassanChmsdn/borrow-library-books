import { AdminBooksModule } from "@/modules/admin-books";
import { listAdminBookRecords } from "@/modules/admin-books/server";

export const metadata = {
  title: "Admin Books",
};

export default async function AdminBooksPage() {
  const records = await listAdminBookRecords();

  return <AdminBooksModule records={records} />;
}
