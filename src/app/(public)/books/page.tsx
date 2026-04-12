import { AllBooksModule } from "@/modules/catalog";
import { listCatalogBooks } from "@/modules/catalog/server";

export const metadata = {
  title: "All Books",
};

export default async function AllBooksPage() {
  const books = await listCatalogBooks();

  return <AllBooksModule books={books} />;
}
