import { AdminBookDetailsModule } from "@/modules/admin-books";
import { requireAdminSectionAccess } from "@/lib/auth/server";

export const metadata = {
  title: "Add Admin Book",
};

export default async function AdminBookCreatePage() {
  await requireAdminSectionAccess("books", "/admin/books/new");

  return <AdminBookDetailsModule mode="create" />;
}