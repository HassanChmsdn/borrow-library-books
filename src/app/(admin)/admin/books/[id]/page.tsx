import {
  AdminBookDetailsEmptyState,
  AdminBookDetailsModule,
  adminBookDetailRecords,
  getAdminBookDetailsRecordById,
} from "@/modules/admin-books";

type AdminBookDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(props: AdminBookDetailsPageProps) {
  const { id } = await props.params;
  const book = getAdminBookDetailsRecordById(id);

  return {
    title: book ? `Edit ${book.title}` : "Edit Book",
  };
}

export function generateStaticParams() {
  return adminBookDetailRecords.map((book) => ({ id: book.id }));
}

export default async function AdminBookEditPage(
  props: AdminBookDetailsPageProps,
) {
  const { id } = await props.params;
  const book = getAdminBookDetailsRecordById(id);

  if (!book) {
    return <AdminBookDetailsEmptyState />;
  }

  return <AdminBookDetailsModule mode="edit" book={book} />;
}