import {
  listBookCopyRecordsForBook,
  listBookRecords,
  listCategoryRecords,
} from "@/lib/data";

export const allBooksSortOptions = [
  { value: "featured", label: "Featured" },
  { value: "title", label: "Title A-Z" },
  { value: "author", label: "Author A-Z" },
  { value: "availability", label: "Availability" },
  { value: "fee", label: "Fee" },
] as const;

export type AllBooksCategory = string;
export type AllBooksSortValue = (typeof allBooksSortOptions)[number]["value"];
export type BookCoverTone =
  | "brand"
  | "stone"
  | "forest"
  | "ocean"
  | "amber"
  | "rose";

export interface AllBooksItem {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  availableCopies: number;
  totalCopies: number;
  feeCents: number;
  coverTone: BookCoverTone;
  coverLabel: string;
}

const categoryNameById = new Map(
  listCategoryRecords().map((category) => [category.id, category.name]),
);

const legacyBookIdAliases: Record<string, string> = {
  "brief-history-of-time": "brief-history-time",
  "design-of-everyday-things": "design-everyday-things",
  "thinking-fast-and-slow": "thinking-fast-slow",
};

export const allBooksCatalog: ReadonlyArray<AllBooksItem> = listBookRecords()
  .filter((book) => book.recordStatus === "active")
  .map((book) => {
    const copies = listBookCopyRecordsForBook(book.id);
    const availableCopies = copies.filter((copy) => copy.status === "available").length;

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      category: categoryNameById.get(book.categoryId) ?? "Uncategorized",
      description: book.description,
      availableCopies,
      totalCopies: copies.length,
      feeCents: book.feeCents,
      coverTone: book.coverTone,
      coverLabel: book.coverLabel,
    } satisfies AllBooksItem;
  })
  .sort((left, right) => left.title.localeCompare(right.title));

export const allBooksCategories: ReadonlyArray<AllBooksCategory> = [
  "All",
  ...new Set(allBooksCatalog.map((book) => book.category)),
];

function resolveBookId(bookId: string) {
  return legacyBookIdAliases[bookId] ?? bookId;
}

function getAllBooksItemById(bookId: string) {
  const resolvedBookId = resolveBookId(bookId);
  return allBooksCatalog.find((book) => book.id === resolvedBookId) ?? null;
}

export { getAllBooksItemById };
