import {
  AdminBookDetailsEmptyState,
  AdminBookDetailsModule,
  adminBookDetailRecords,
  getAdminBookDetailsRecordById,
} from "@/modules/admin-books";

type AdminBookDetailsPageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export async function generateMetadata(props: AdminBookDetailsPageProps) {
  const { bookId } = await props.params;
  const book = getAdminBookDetailsRecordById(bookId);

  return {
    title: book ? `Edit ${book.title}` : "Edit Book",
  };
}

export function generateStaticParams() {
  return adminBookDetailRecords.map((book) => ({ bookId: book.id }));
}

export default async function AdminBookEditPage(
  props: AdminBookDetailsPageProps,
) {
  const { bookId } = await props.params;
  const book = getAdminBookDetailsRecordById(bookId);

  if (!book) {
    return <AdminBookDetailsEmptyState />;
  }

  return <AdminBookDetailsModule mode="edit" book={book} />;
}