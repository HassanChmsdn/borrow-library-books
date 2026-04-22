import type {
  CreateBookCopyInput,
  CreateBookInput,
  CreateBorrowRequestInput,
  CreateCategoryInput,
  CreateUserInput,
} from "@/lib/db";

export interface SeedCategory extends CreateCategoryInput {
  key: string;
}

export interface SeedBook extends Omit<CreateBookInput, "categoryId"> {
  key: string;
  categoryKey: string;
}

export interface SeedBookCopy extends Omit<CreateBookCopyInput, "bookId"> {
  bookKey: string;
  key: string;
}

export interface SeedUser extends CreateUserInput {
  bootstrapAdmin?: boolean;
  key: string;
}

export interface SeedBorrowRequest
  extends Omit<CreateBorrowRequestInput, "bookCopyId" | "bookId" | "requestedAt" | "userId"> {
  approvedDurationDays?: number;
  bookCopyKey: string;
  bookKey: string;
  key: string;
  requestedDaysAgo: number;
  reviewedByUserKey?: string;
  startedDaysAgo?: number;
  userKey: string;
}

export const seedCategories: SeedCategory[] = [
  {
    key: "science",
    name: "Science",
    slug: "science",
    description: "Physics, astronomy, biology, and popular science titles.",
  },
  {
    key: "design",
    name: "Design",
    slug: "design",
    description: "Design thinking, product, typography, and visual culture.",
  },
  {
    key: "literature",
    name: "Literature",
    slug: "literature",
    description: "Modern classics, essays, and literary fiction.",
  },
  {
    key: "technology",
    name: "Technology",
    slug: "technology",
    description: "Programming, systems, software craft, and digital product work.",
  },
  {
    key: "history",
    name: "History",
    slug: "history",
    description: "Political, cultural, and social history collections.",
  },
];

export const seedBooks: SeedBook[] = [
  {
    key: "brief-history",
    categoryKey: "science",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "9780553380163",
    description:
      "A foundational popular science title that introduces cosmology, black holes, and time to a broad audience.",
    feeCents: 0,
    allowCustomDuration: false,
    predefinedDurations: [7, 14, 21],
    status: "active",
    metadata: {
      publisher: "Bantam",
      publishedYear: "1998",
      language: "English",
    },
  },
  {
    key: "design-everyday",
    categoryKey: "design",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    isbn: "9780465050659",
    description:
      "A practical design systems and usability reference used across product and service design work.",
    feeCents: 150,
    allowCustomDuration: true,
    predefinedDurations: [7, 14],
    status: "active",
    metadata: {
      publisher: "Basic Books",
      publishedYear: "2013",
      language: "English",
    },
  },
  {
    key: "ways-of-seeing",
    categoryKey: "design",
    title: "Ways of Seeing",
    author: "John Berger",
    isbn: "9780140135152",
    description:
      "A concise visual culture classic often used in introductory design and media literacy reading lists.",
    feeCents: 100,
    allowCustomDuration: false,
    predefinedDurations: [7, 14],
    status: "active",
    metadata: {
      publisher: "Penguin",
      publishedYear: "1990",
      language: "English",
    },
  },
  {
    key: "intro-wild",
    categoryKey: "literature",
    title: "Into the Wild",
    author: "Jon Krakauer",
    isbn: "9780385486804",
    description:
      "A narrative nonfiction title used often in contemporary literature and storytelling collections.",
    feeCents: 0,
    allowCustomDuration: false,
    predefinedDurations: [7, 14],
    status: "active",
    metadata: {
      publisher: "Anchor Books",
      publishedYear: "1997",
      language: "English",
    },
  },
  {
    key: "clean-code",
    categoryKey: "technology",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    description:
      "A software craftsmanship reference used for internal engineering reading programs and team study sessions.",
    feeCents: 250,
    allowCustomDuration: true,
    predefinedDurations: [14, 21],
    status: "active",
    metadata: {
      publisher: "Prentice Hall",
      publishedYear: "2008",
      language: "English",
    },
  },
  {
    key: "operating-systems",
    categoryKey: "technology",
    title: "Operating Systems: Three Easy Pieces",
    author: "Remzi H. Arpaci-Dusseau",
    isbn: "9781985086593",
    description:
      "A systems programming title used for advanced engineering and infrastructure study.",
    feeCents: 300,
    allowCustomDuration: true,
    predefinedDurations: [14, 21, 28],
    status: "active",
    metadata: {
      publisher: "Arpaci-Dusseau Books",
      publishedYear: "2018",
      language: "English",
    },
  },
  {
    key: "sapiens",
    categoryKey: "history",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    description:
      "A broad history title frequently borrowed in interdisciplinary reading groups.",
    feeCents: 200,
    allowCustomDuration: false,
    predefinedDurations: [7, 14, 21],
    status: "active",
    metadata: {
      publisher: "Harper",
      publishedYear: "2015",
      language: "English",
    },
  },
];

export const seedBookCopies: SeedBookCopy[] = [
  {
    key: "brief-history-1",
    bookKey: "brief-history",
    copyCode: "SCI-001",
    condition: "good",
    status: "available",
  },
  {
    key: "brief-history-2",
    bookKey: "brief-history",
    copyCode: "SCI-002",
    condition: "fair",
    status: "available",
  },
  {
    key: "design-everyday-1",
    bookKey: "design-everyday",
    copyCode: "DSN-001",
    condition: "good",
    status: "available",
  },
  {
    key: "design-everyday-2",
    bookKey: "design-everyday",
    copyCode: "DSN-002",
    condition: "fair",
    status: "maintenance",
    notes: "Cover spine repair pending.",
  },
  {
    key: "ways-of-seeing-1",
    bookKey: "ways-of-seeing",
    copyCode: "DSN-003",
    condition: "good",
    status: "available",
  },
  {
    key: "into-the-wild-1",
    bookKey: "intro-wild",
    copyCode: "LIT-001",
    condition: "new",
    status: "available",
  },
  {
    key: "clean-code-1",
    bookKey: "clean-code",
    copyCode: "TEC-001",
    condition: "good",
    status: "available",
  },
  {
    key: "clean-code-2",
    bookKey: "clean-code",
    copyCode: "TEC-002",
    condition: "good",
    status: "available",
  },
  {
    key: "operating-systems-1",
    bookKey: "operating-systems",
    copyCode: "TEC-003",
    condition: "fair",
    status: "available",
  },
  {
    key: "sapiens-1",
    bookKey: "sapiens",
    copyCode: "HIS-001",
    condition: "good",
    status: "available",
  },
];

export const seedUsers: SeedUser[] = [
  {
    key: "admin-samira",
    auth0UserId: "auth0|seed-admin-samira",
    email: "samira.chahine@library.test",
    name: "Samira Chahine",
    role: "admin",
    status: "active",
    bootstrapAdmin: true,
  },
  {
    key: "member-sara",
    auth0UserId: "auth0|seed-member-sara",
    email: "sara.chehab@library.test",
    name: "Sara Chehab",
    role: "member",
    status: "active",
  },
  {
    key: "member-maya",
    auth0UserId: "auth0|seed-member-maya",
    email: "maya.sayegh@library.test",
    name: "Maya Sayegh",
    role: "member",
    status: "active",
  },
  {
    key: "member-rana",
    auth0UserId: "auth0|seed-member-rana",
    email: "rana.azar@library.test",
    name: "Rana Azar",
    role: "member",
    status: "active",
  },
  {
    key: "member-noor",
    auth0UserId: "auth0|seed-member-noor",
    email: "noor.haddad@library.test",
    name: "Noor Haddad",
    role: "member",
    status: "suspended",
  },
];

export const seedBorrowRequests: SeedBorrowRequest[] = [
  {
    key: "brief-history-pending-sara",
    bookCopyKey: "brief-history-2",
    bookKey: "brief-history",
    durationType: "predefined",
    feeCents: 0,
    notes: "Seed scenario [brief-history-pending-sara]: Pending approval sample.",
    paymentMethod: "onsite-cash",
    paymentStatus: "waived",
    requestedDaysAgo: 2,
    requestedDurationDays: 14,
    status: "pending",
    userKey: "member-sara",
  },
  {
    key: "clean-code-active-maya",
    approvedDurationDays: 14,
    bookCopyKey: "clean-code-1",
    bookKey: "clean-code",
    durationType: "predefined",
    feeCents: 250,
    notes: "Seed scenario [clean-code-active-maya]: Active borrowing sample.",
    paymentMethod: "onsite-cash",
    paymentStatus: "paid",
    requestedDaysAgo: 6,
    requestedDurationDays: 14,
    reviewedByUserKey: "admin-samira",
    startedDaysAgo: 5,
    status: "active",
    userKey: "member-maya",
  },
];