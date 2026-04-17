import {
  AdminBookDetailsEmptyState,
  AdminBookDetailsModule,
} from "@/modules/admin-books";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import {
  getAdminBookDetailsRecordByIdFromStore,
  listAdminBookDetailRecords,
} from "@/modules/admin-books/server";

type AdminBookDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(props: AdminBookDetailsPageProps) {
  const { id } = await props.params;
  const book = await getAdminBookDetailsRecordByIdFromStore(id);

  return {
    title: book ? `Edit ${book.title}` : "Edit Book",
  };
}

export async function generateStaticParams() {
  const books = await listAdminBookDetailRecords();

  return books.map((book) => ({ id: book.id }));
}

export default async function AdminBookEditPage(
  props: AdminBookDetailsPageProps,
) {
  const { id } = await props.params;
  await requireAuthorizedRoute(`/admin/books/${id}`);
  const book = await getAdminBookDetailsRecordByIdFromStore(id);

  if (!book) {
    return <AdminBookDetailsEmptyState />;
  }

  return <AdminBookDetailsModule mode="edit" book={book} />;
}