export const allBooksCategories = [
  "All",
  "Fiction",
  "Science",
  "History",
  "Philosophy",
  "Technology",
  "Art & Design",
  "Business",
  "Travel",
] as const;

export const allBooksSortOptions = [
  { value: "featured", label: "Featured" },
  { value: "title", label: "Title A-Z" },
  { value: "author", label: "Author A-Z" },
  { value: "availability", label: "Availability" },
  { value: "fee", label: "Fee" },
] as const;

export type AllBooksCategory = (typeof allBooksCategories)[number];
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
  category: Exclude<AllBooksCategory, "All">;
  availableCopies: number;
  totalCopies: number;
  feeCents: number;
  coverTone: BookCoverTone;
  coverLabel: string;
}

export const allBooksCatalog: ReadonlyArray<AllBooksItem> = [
  {
    id: "1984",
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    availableCopies: 4,
    totalCopies: 6,
    feeCents: 0,
    coverTone: "brand",
    coverLabel: "Classic Fiction",
  },
  {
    id: "brief-history-of-time",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    availableCopies: 1,
    totalCopies: 3,
    feeCents: 350,
    coverTone: "ocean",
    coverLabel: "Popular Science",
  },
  {
    id: "clean-code",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    availableCopies: 1,
    totalCopies: 3,
    feeCents: 0,
    coverTone: "stone",
    coverLabel: "Software Craft",
  },
  {
    id: "into-the-wild",
    title: "Into the Wild",
    author: "Jon Krakauer",
    category: "Travel",
    availableCopies: 3,
    totalCopies: 3,
    feeCents: 150,
    coverTone: "forest",
    coverLabel: "Travel Memoir",
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    category: "Philosophy",
    availableCopies: 0,
    totalCopies: 2,
    feeCents: 200,
    coverTone: "amber",
    coverLabel: "Philosophy",
  },
  {
    id: "salt-fat-acid-heat",
    title: "Salt, Fat, Acid, Heat",
    author: "Samin Nosrat",
    category: "Art & Design",
    availableCopies: 2,
    totalCopies: 3,
    feeCents: 300,
    coverTone: "rose",
    coverLabel: "Food Design",
  },
  {
    id: "sapiens",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    availableCopies: 2,
    totalCopies: 4,
    feeCents: 100,
    coverTone: "stone",
    coverLabel: "Global History",
  },
  {
    id: "art-of-war",
    title: "The Art of War",
    author: "Sun Tzu",
    category: "History",
    availableCopies: 1,
    totalCopies: 4,
    feeCents: 0,
    coverTone: "brand",
    coverLabel: "Strategy",
  },
  {
    id: "design-of-everyday-things",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    category: "Art & Design",
    availableCopies: 3,
    totalCopies: 4,
    feeCents: 0,
    coverTone: "amber",
    coverLabel: "Product Design",
  },
  {
    id: "great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    availableCopies: 3,
    totalCopies: 5,
    feeCents: 0,
    coverTone: "rose",
    coverLabel: "American Novel",
  },
  {
    id: "poetry-of-rumi",
    title: "The Poetry of Rumi",
    author: "Jalal ad-Din Rumi",
    category: "Philosophy",
    availableCopies: 5,
    totalCopies: 5,
    feeCents: 200,
    coverTone: "forest",
    coverLabel: "Poetry",
  },
  {
    id: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "Business",
    availableCopies: 2,
    totalCopies: 4,
    feeCents: 225,
    coverTone: "ocean",
    coverLabel: "Decision Making",
  },
];
