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
  description: string;
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
    description:
      "A chilling portrait of a surveillance state where language, memory, and truth are constantly rewritten. The book remains a compact, urgent read for anyone interested in power, resistance, and civic freedom.",
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
    description:
      "Stephen Hawking opens complex ideas about black holes, cosmology, and time to general readers with clarity and curiosity. It is ideal for readers who want big scientific questions in an approachable format.",
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
    description:
      "A practical guide to writing software that is easier to read, maintain, and evolve. Its examples and principles are especially useful for engineers who want stronger day-to-day coding habits.",
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
    description:
      "A reflective narrative of idealism, risk, and isolation told through the story of Christopher McCandless. The writing combines travel writing, biography, and investigative reporting.",
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
    description:
      "A collection of personal reflections on discipline, responsibility, and perspective from the Roman emperor and Stoic thinker. It is concise, grounded, and often revisited in short reading sessions.",
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
    description:
      "Part cooking guide and part design system for flavor, this book explains how four core elements shape food. It pairs practical instruction with strong editorial and visual presentation.",
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
    description:
      "An expansive narrative about how shared beliefs, systems, and technologies shaped human societies over time. The book balances sweeping perspective with accessible explanations.",
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
    description:
      "A short classic on strategy, judgment, and timing that continues to influence leadership, military thought, and negotiation. Readers often approach it in short, rereadable sections.",
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
    description:
      "A foundational read on usability, affordances, and human-centered product thinking. It is especially strong for readers working across service, digital, and physical design.",
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
    description:
      "A sharp, lyrical novel about status, longing, and reinvention during the Jazz Age. Its compact structure makes it well suited to short borrowing windows and rereads.",
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
    description:
      "A contemplative collection centered on longing, presence, and spiritual reflection. It works well for readers who prefer dipping in and out rather than reading straight through.",
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
    description:
      "An influential exploration of cognitive bias, decision making, and the two modes of human thinking. It is dense but rewarding for readers who like analytical nonfiction.",
    availableCopies: 2,
    totalCopies: 4,
    feeCents: 225,
    coverTone: "ocean",
    coverLabel: "Decision Making",
  },
];

function getAllBooksItemById(bookId: string) {
  return allBooksCatalog.find((book) => book.id === bookId);
}

export { getAllBooksItemById };
