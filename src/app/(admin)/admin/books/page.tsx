import { AdminBooksModule } from "@/modules/admin-books";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import { listAdminBookRecords } from "@/modules/admin-books/server";

export const metadata = {
  title: "Admin Books",
};

export default async function AdminBooksPage() {
  await requireAuthorizedRoute("/admin/books");
  const records = await listAdminBookRecords();

  return <AdminBooksModule records={records} />;
}
