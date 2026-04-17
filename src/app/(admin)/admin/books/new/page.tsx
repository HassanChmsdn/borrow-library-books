import { AdminBookDetailsModule } from "@/modules/admin-books";
import { requireAuthorizedRoute } from "@/lib/auth/server";

export const metadata = {
  title: "Add Admin Book",
};

export default async function AdminBookCreatePage() {
  await requireAuthorizedRoute("/admin/books/new");

  return <AdminBookDetailsModule mode="create" />;
}