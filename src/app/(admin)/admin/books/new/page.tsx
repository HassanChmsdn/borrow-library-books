import { AdminBookDetailsModule } from "@/modules/admin-books";

export const metadata = {
  title: "Add Admin Book",
};

export default function AdminBookCreatePage() {
  return <AdminBookDetailsModule mode="create" />;
}