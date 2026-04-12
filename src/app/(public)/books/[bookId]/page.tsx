import { BookDetailsEmptyState, BookDetailsModule } from "@/modules/catalog";
import { getCatalogBookDetailsById, listCatalogBooks } from "@/modules/catalog/server";

type BookDetailsPageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export async function generateMetadata(props: BookDetailsPageProps) {
  const { bookId } = await props.params;
  const book = await getCatalogBookDetailsById(bookId);

  return {
    title: book ? `${book.book.title} | Book Details` : "Book Details",
  };
}

export async function generateStaticParams() {
  const books = await listCatalogBooks();

  return books.map((book) => ({ bookId: book.id }));
}

export default async function BookDetailsPage(props: BookDetailsPageProps) {
  const { bookId } = await props.params;
  const book = await getCatalogBookDetailsById(bookId);

  if (!book) {
    return <BookDetailsEmptyState />;
  }

  return <BookDetailsModule allowCustomDuration={book.allowCustomDuration} book={book.book} />;
}
