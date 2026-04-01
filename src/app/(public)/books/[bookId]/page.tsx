import {
  getAllBooksItemById,
  allBooksCatalog,
} from "@/modules/catalog/all-books-data";
import { BookDetailsEmptyState, BookDetailsModule } from "@/modules/catalog";

type BookDetailsPageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export async function generateMetadata(props: BookDetailsPageProps) {
  const { bookId } = await props.params;
  const book = getAllBooksItemById(bookId);

  return {
    title: book ? `${book.title} | Book Details` : "Book Details",
  };
}

export function generateStaticParams() {
  return allBooksCatalog.map((book) => ({ bookId: book.id }));
}

export default async function BookDetailsPage(props: BookDetailsPageProps) {
  const { bookId } = await props.params;
  const book = getAllBooksItemById(bookId);

  if (!book) {
    return <BookDetailsEmptyState />;
  }

  return <BookDetailsModule book={book} />;
}
