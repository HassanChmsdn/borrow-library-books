import type { BookCoverTone } from "@/modules/catalog/all-books-data";

import type {
  AdminBookCategory,
  AdminBookDetailsRecord,
  AdminBookDurationOption,
  AdminBookFormValues,
  AdminBookRecord,
  AdminBooksCategory,
  AdminBooksStatusFilter,
} from "./types";

function deriveAvailabilityState(
  availableCopies: number,
  totalCopies: number,
): Pick<AdminBookRecord, "availabilityTone" | "statusLabel" | "statusTone"> {
  if (availableCopies === 0) {
    return {
      availabilityTone: "unavailable",
      statusLabel: "Out of stock",
      statusTone: "danger",
    };
  }

  if (availableCopies / totalCopies <= 0.34) {
    return {
      availabilityTone: "limited",
      statusLabel: "Low stock",
      statusTone: "warning",
    };
  }

  return {
    availabilityTone: "available",
    statusLabel: "Available",
    statusTone: "success",
  };
}

function createBookRecord(
  details: Omit<AdminBookDetailsRecord, "availabilityTone" | "statusLabel" | "statusTone">,
): AdminBookDetailsRecord {
  return {
    ...details,
    ...deriveAvailabilityState(details.availableCopies, details.totalCopies),
  };
}

const defaultBookMetadata = {
  edition: "",
  language: "English",
  publishedYear: "",
  publisher: "",
} as const;

const defaultDurationOptions = [7, 14, 21] as const;

const categoryCoverTones: Record<AdminBookCategory, BookCoverTone> = {
  "Art & Design": "rose",
  Business: "ocean",
  Fiction: "brand",
  History: "stone",
  Philosophy: "amber",
  Science: "ocean",
  Technology: "stone",
  Travel: "forest",
};

export const adminBooksCategories: ReadonlyArray<AdminBooksCategory> = [
  "All",
  "Fiction",
  "Science",
  "History",
  "Philosophy",
  "Technology",
  "Art & Design",
  "Business",
  "Travel",
];

export const adminBooksStatusOptions: ReadonlyArray<{
  label: string;
  value: AdminBooksStatusFilter;
}> = [
  { label: "All states", value: "all" },
  { label: "Available", value: "healthy" },
  { label: "Low stock", value: "limited" },
  { label: "Out of stock", value: "archived" },
];

export const adminBookDurationOptions: ReadonlyArray<AdminBookDurationOption> = [
  { days: 7, label: "7 days", helperText: "Short pickup cycle" },
  { days: 14, label: "14 days", helperText: "Standard circulation" },
  { days: 21, label: "21 days", helperText: "Extended loan" },
  { days: 28, label: "28 days", helperText: "Research hold" },
];

export const adminBookDetailRecords: ReadonlyArray<AdminBookDetailsRecord> = [
  createBookRecord({
    id: "1984",
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    shelfCode: "FIC-19",
    totalCopies: 6,
    availableCopies: 4,
    feeCents: 250,
    coverTone: "brand",
    coverLabel: "1984",
    coverImageFileName: "1984-front-cover.jpg",
    isbn: "978-0-452-28423-4",
    description:
      "A high-circulation classic used in multiple school reading lists. Staff keep the description practical and short so catalog editors can swap in final metadata once the real API is connected.",
    predefinedDurations: [7, 14, 21],
    allowCustomDuration: true,
    metadata: {
      edition: "Centennial edition",
      language: "English",
      publishedYear: "1949",
      publisher: "Secker & Warburg",
    },
    recordStatus: "active",
    inventorySummary: {
      availableCopies: 4,
      borrowedCopies: 2,
      branchLabel: "Central Library",
      lastAuditLabel: "Audited 2 days ago",
      reservedCopies: 1,
      shelfCode: "FIC-19",
      totalCopies: 6,
    },
  }),
  createBookRecord({
    id: "brief-history-time",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    shelfCode: "SCI-08",
    totalCopies: 3,
    availableCopies: 1,
    feeCents: 350,
    coverTone: "ocean",
    coverLabel: "Time",
    coverImageFileName: "brief-history-time-cover.png",
    isbn: "978-0-553-10953-5",
    description:
      "A science title that regularly cycles through student reservations. The edit form keeps fee and duration controls explicit because this title often needs tailored circulation settings.",
    predefinedDurations: [14, 21],
    allowCustomDuration: false,
    metadata: {
      edition: "Updated paperback",
      language: "English",
      publishedYear: "1988",
      publisher: "Bantam Books",
    },
    recordStatus: "active",
    inventorySummary: {
      availableCopies: 1,
      borrowedCopies: 2,
      branchLabel: "Science Annex",
      lastAuditLabel: "Audited yesterday",
      reservedCopies: 1,
      shelfCode: "SCI-08",
      totalCopies: 3,
    },
  }),
  createBookRecord({
    id: "clean-code",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    shelfCode: "TEC-14",
    totalCopies: 3,
    availableCopies: 1,
    feeCents: 0,
    coverTone: "stone",
    coverLabel: "Code",
    coverImageFileName: "clean-code-cover.jpg",
    isbn: "978-0-13-235088-4",
    description:
      "A technical staple held in the software shelf rotation. The free-fee configuration is useful for testing form validation around books that never require onsite cash collection.",
    predefinedDurations: [14, 21, 28],
    allowCustomDuration: true,
    metadata: {
      edition: "First edition",
      language: "English",
      publishedYear: "2008",
      publisher: "Prentice Hall",
    },
    recordStatus: "active",
    inventorySummary: {
      availableCopies: 1,
      borrowedCopies: 2,
      branchLabel: "Technology Floor",
      lastAuditLabel: "Audited 4 days ago",
      reservedCopies: 0,
      shelfCode: "TEC-14",
      totalCopies: 3,
    },
  }),
  createBookRecord({
    id: "into-the-wild",
    title: "Into the Wild",
    author: "Jon Krakauer",
    category: "Travel",
    shelfCode: "TRA-02",
    totalCopies: 4,
    availableCopies: 4,
    feeCents: 150,
    coverTone: "forest",
    coverLabel: "Wild",
    coverImageFileName: "into-the-wild-cover.jpg",
    isbn: "978-0-385-48680-4",
    description:
      "A travel memoir kept active for seasonal browsing collections. This record is a useful example of a paid title with full stock available and a custom duration toggle enabled.",
    predefinedDurations: [7, 14],
    allowCustomDuration: true,
    metadata: {
      edition: "Anchor Books",
      language: "English",
      publishedYear: "1997",
      publisher: "Villard",
    },
    recordStatus: "active",
    inventorySummary: {
      availableCopies: 4,
      borrowedCopies: 0,
      branchLabel: "Travel Shelf",
      lastAuditLabel: "Audited 1 week ago",
      reservedCopies: 0,
      shelfCode: "TRA-02",
      totalCopies: 4,
    },
  }),
  createBookRecord({
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    category: "Philosophy",
    shelfCode: "PHI-03",
    totalCopies: 2,
    availableCopies: 0,
    feeCents: 0,
    coverTone: "amber",
    coverLabel: "Mind",
    coverImageFileName: "meditations-cover.jpg",
    isbn: "978-0-8129-7468-0",
    description:
      "A high-demand philosophy title currently unavailable on shelf. The inactive status is reserved for catalog suppression, so this record stays active even when circulation stock is zero.",
    predefinedDurations: [14, 21],
    allowCustomDuration: false,
    metadata: {
      edition: "Modern Library Classics",
      language: "English",
      publishedYear: "2002",
      publisher: "Modern Library",
    },
    recordStatus: "active",
    inventorySummary: {
      availableCopies: 0,
      borrowedCopies: 2,
      branchLabel: "Philosophy Stack",
      lastAuditLabel: "Audited today",
      reservedCopies: 1,
      shelfCode: "PHI-03",
      totalCopies: 2,
    },
  }),
  createBookRecord({
    id: "sapiens",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    shelfCode: "HIS-21",
    totalCopies: 5,
    availableCopies: 2,
    feeCents: 200,
    coverTone: "rose",
    coverLabel: "Past",
    coverImageFileName: "sapiens-cover.jpg",
    isbn: "978-0-06-231609-7",
    description:
      "A broad-audience history title with steady demand and moderate fee coverage. The mock metadata reflects a typical active record ready for later API-backed editing.",
    predefinedDurations: [14, 21, 28],
    allowCustomDuration: true,
    metadata: {
      edition: "Illustrated edition",
      language: "English",
      publishedYear: "2015",
      publisher: "Harper",
    },
    recordStatus: "active",
    inventorySummary: {
      availableCopies: 2,
      borrowedCopies: 3,
      branchLabel: "History Wing",
      lastAuditLabel: "Audited 3 days ago",
      reservedCopies: 2,
      shelfCode: "HIS-21",
      totalCopies: 5,
    },
  }),
  createBookRecord({
    id: "thinking-fast-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "Business",
    shelfCode: "BUS-07",
    totalCopies: 5,
    availableCopies: 3,
    feeCents: 300,
    coverTone: "brand",
    coverLabel: "Mindset",
    coverImageFileName: "thinking-fast-slow-cover.jpg",
    isbn: "978-0-374-27563-1",
    description:
      "A business and psychology crossover title with strong long-loan usage. It is a useful mock record for testing paid circulation and richer publication metadata.",
    predefinedDurations: [14, 21],
    allowCustomDuration: true,
    metadata: {
      edition: "First paperback",
      language: "English",
      publishedYear: "2011",
      publisher: "Farrar, Straus and Giroux",
    },
    recordStatus: "active",
    inventorySummary: {
      availableCopies: 3,
      borrowedCopies: 2,
      branchLabel: "Management Desk",
      lastAuditLabel: "Audited 5 days ago",
      reservedCopies: 0,
      shelfCode: "BUS-07",
      totalCopies: 5,
    },
  }),
  createBookRecord({
    id: "ways-seeing",
    title: "Ways of Seeing",
    author: "John Berger",
    category: "Art & Design",
    shelfCode: "ART-11",
    totalCopies: 2,
    availableCopies: 1,
    feeCents: 100,
    coverTone: "rose",
    coverLabel: "Seeing",
    coverImageFileName: "ways-seeing-cover.jpg",
    isbn: "978-0-14-013515-2",
    description:
      "An art and visual culture title used for browsing collections and classroom support. This mock record shows an active title with minimal remaining stock and a small fee.",
    predefinedDurations: [7, 14],
    allowCustomDuration: false,
    metadata: {
      edition: "Penguin Modern Classics",
      language: "English",
      publishedYear: "1972",
      publisher: "BBC / Penguin",
    },
    recordStatus: "inactive",
    inventorySummary: {
      availableCopies: 1,
      borrowedCopies: 1,
      branchLabel: "Arts Reading Room",
      lastAuditLabel: "Audited this morning",
      reservedCopies: 0,
      shelfCode: "ART-11",
      totalCopies: 2,
    },
  }),
];

export const adminBooksCatalog: ReadonlyArray<AdminBookRecord> =
  adminBookDetailRecords.map((record) => ({
    id: record.id,
    title: record.title,
    author: record.author,
    category: record.category,
    shelfCode: record.shelfCode,
    totalCopies: record.totalCopies,
    availableCopies: record.availableCopies,
    feeCents: record.feeCents,
    coverTone: record.coverTone,
    coverLabel: record.coverLabel,
    availabilityTone: record.availabilityTone,
    statusLabel: record.statusLabel,
    statusTone: record.statusTone,
  }));

export const adminBookCreateDefaults: AdminBookFormValues = {
  basicInfo: {
    author: "",
    category: "Fiction",
    description: "",
    isbn: "",
    title: "",
  },
  cover: {
    fileName: "",
  },
  durationSettings: {
    allowCustomDuration: true,
    presetDays: [...defaultDurationOptions],
  },
  feeSettings: {
    amount: "",
    mode: "free",
  },
  metadata: {
    ...defaultBookMetadata,
  },
  status: "active",
};

export function createAdminBookFormValues(
  record: AdminBookDetailsRecord,
): AdminBookFormValues {
  return {
    basicInfo: {
      author: record.author,
      category: record.category,
      description: record.description,
      isbn: record.isbn,
      title: record.title,
    },
    cover: {
      fileName: record.coverImageFileName,
    },
    durationSettings: {
      allowCustomDuration: record.allowCustomDuration,
      presetDays: [...record.predefinedDurations],
    },
    feeSettings: {
      amount: record.feeCents === 0 ? "" : (record.feeCents / 100).toFixed(2),
      mode: record.feeCents === 0 ? "free" : "cash",
    },
    metadata: {
      edition: record.metadata.edition,
      language: record.metadata.language,
      publishedYear: record.metadata.publishedYear,
      publisher: record.metadata.publisher,
    },
    status: record.recordStatus,
  };
}

export function deriveAdminBookCoverTone(category: AdminBookCategory): BookCoverTone {
  return categoryCoverTones[category];
}

export function getAdminBookDetailsRecordById(bookId: string) {
  return adminBookDetailRecords.find((record) => record.id === bookId);
}