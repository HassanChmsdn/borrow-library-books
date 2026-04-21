import type {
  AdminSharedActivityRecord,
  AdminSharedBookRecord,
  AdminSharedBorrowingRecord,
  AdminSharedCategoryId,
  AdminSharedCategoryRecord,
  AdminSharedInventoryCopyRecord,
  AdminSharedPaymentStatus,
  AdminSharedUserRecord,
} from "./types";

export const adminSharedNow = new Date("2026-04-03T12:30:00.000Z");

function toUtcDate(value: string) {
  return new Date(value);
}

function padNumber(value: number) {
  return value.toString().padStart(2, "0");
}

export function formatAdminShortDate(value: string) {
  const date = toUtcDate(value);

  return `${padNumber(date.getUTCDate())}.${padNumber(date.getUTCMonth() + 1)}.${date.getUTCFullYear()}`;
}

export function formatAdminDateTime(value: string) {
  const date = toUtcDate(value);
  const hours = padNumber(date.getUTCHours());
  const minutes = padNumber(date.getUTCMinutes());

  return `${formatAdminShortDate(value)}, ${hours}:${minutes}`;
}

export function formatAdminJoinedDate(value: string) {
  return formatAdminShortDate(value);
}

export function formatAdminRelativeAuditLabel(value: string) {
  return formatAdminShortDate(value);
}

export function formatAdminActivityMeta(value: string) {
  return formatAdminDateTime(value);
}

export function formatAdminCurrency(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getAdminBorrowingLateLabel(dueOn: string) {
  const diffInDays = Math.max(
    1,
    Math.floor((adminSharedNow.getTime() - toUtcDate(dueOn).getTime()) / (1000 * 60 * 60 * 24)),
  );

  return `+${diffInDays}d`;
}

export function getAdminBorrowingWindowLabel(record: AdminSharedBorrowingRecord) {
  if (record.status === "pending") {
    return `Requested ${formatAdminDateTime(record.requestedOn)}`;
  }

  if (record.startedOn) {
    return `Started ${formatAdminShortDate(record.startedOn)}`;
  }

  return `Requested ${formatAdminDateTime(record.requestedOn)}`;
}

export function getAdminBorrowingDueLabel(record: AdminSharedBorrowingRecord) {
  if (record.status === "returned" && record.returnedOn) {
    return `Returned ${formatAdminShortDate(record.returnedOn)}`;
  }

  if (record.startedOn) {
    const dueDate = new Date(toUtcDate(record.startedOn).getTime() + record.durationDays * 24 * 60 * 60 * 1000);
    return `Due ${formatAdminShortDate(dueDate.toISOString())}`;
  }

  const pickupDeadline = new Date(toUtcDate(record.requestedOn).getTime() + 24 * 60 * 60 * 1000);
  return `Pickup by ${formatAdminDateTime(pickupDeadline.toISOString())}`;
}

export function getAdminSharedDurationLabel(days: number) {
  return `${days} days`;
}

export const adminSharedCategories: ReadonlyArray<AdminSharedCategoryRecord> = [
  {
    id: "fiction",
    name: "Fiction",
    description:
      "Narrative titles that drive the highest walk-in browsing demand and classroom circulation spikes.",
    iconKey: "fiction",
    markerTone: "brand",
  },
  {
    id: "science",
    name: "Science",
    description:
      "Research-led science reading with strong student demand and reservation-driven copy planning.",
    iconKey: "science",
    markerTone: "info",
  },
  {
    id: "history",
    name: "History",
    description:
      "Archive, biography, and context-heavy titles used in both assignments and display programming.",
    iconKey: "history",
    markerTone: "neutral",
  },
  {
    id: "philosophy",
    name: "Philosophy",
    description:
      "Ethics, theory, and reflective reading that often needs longer-loan review and close follow-up.",
    iconKey: "philosophy",
    markerTone: "warning",
  },
  {
    id: "technology",
    name: "Technology",
    description:
      "Software and engineering titles with high repeat borrowing and frequent syllabus alignment changes.",
    iconKey: "technology",
    markerTone: "success",
  },
  {
    id: "art-design",
    name: "Art & Design",
    description:
      "Visual culture and design-system titles curated for browsing, coursework, and shelf displays.",
    iconKey: "art-design",
    markerTone: "danger",
  },
  {
    id: "business",
    name: "Business",
    description:
      "Leadership, finance, and operations titles that frequently carry onsite-cash borrowing fees.",
    iconKey: "business",
    markerTone: "info",
  },
  {
    id: "travel",
    name: "Travel",
    description:
      "Memoirs and place-based browsing titles grouped for seasonal displays and guided reading picks.",
    iconKey: "travel",
    markerTone: "warning",
  },
];

export const adminSharedUsers: ReadonlyArray<AdminSharedUserRecord> = [
  {
    id: "sara-chehab",
    fullName: "Sara Chehab",
    email: "sara.chehab@library.test",
    role: "user",
    status: "active",
    joinedOn: "2026-01-14T00:00:00.000Z",
    membershipLabel: "Member account",
    profileNote:
      "Frequent circulation reader with one approved custom-duration technical loan and steady on-time returns.",
  },
  {
    id: "lina-saad",
    fullName: "Lina Saad",
    email: "lina.saad@library.test",
    role: "user",
    status: "suspended",
    joinedOn: "2025-11-02T00:00:00.000Z",
    membershipLabel: "Community plan",
    profileNote:
      "Account currently suspended until overdue material is recovered and onsite cash settlement is completed.",
  },
  {
    id: "maya-sayegh",
    fullName: "Maya Sayegh",
    email: "maya.sayegh@library.test",
    role: "user",
    status: "active",
    joinedOn: "2026-02-19T00:00:00.000Z",
    membershipLabel: "Research plan",
    profileNote:
      "High-activity borrower with multiple simultaneous loans and periodic extended-duration approvals for research work.",
  },
  {
    id: "noor-haddad",
    fullName: "Noor Haddad",
    email: "noor.haddad@library.test",
    role: "user",
    status: "active",
    joinedOn: "2025-09-08T00:00:00.000Z",
    membershipLabel: "Student plan",
    profileNote:
      "Student borrower with frequent pickup requests and strong fiction and travel circulation history.",
  },
  {
    id: "rami-nader",
    fullName: "Rami Nader",
    email: "rami.nader@library.test",
    role: "user",
    status: "active",
    joinedOn: "2025-10-11T00:00:00.000Z",
    membershipLabel: "Faculty plan",
    profileNote:
      "Faculty reader with an overdue philosophy title requiring follow-up before the next review round.",
  },
  {
    id: "rana-azar",
    fullName: "Rana Azar",
    email: "rana.azar@library.test",
    role: "user",
    status: "active",
    joinedOn: "2026-03-28T00:00:00.000Z",
    membershipLabel: "New reader",
    profileNote:
      "Recently onboarded member account awaiting its first completed borrowing cycle.",
  },
  {
    id: "dana-hage",
    fullName: "Dana Hage",
    email: "dana.hage@library.test",
    role: "user",
    status: "active",
    joinedOn: "2025-07-20T00:00:00.000Z",
    membershipLabel: "Reader plan",
    profileNote:
      "Reliable fiction borrower with steady renewals and clean circulation history.",
  },
  {
    id: "jad-khoury",
    fullName: "Jad Khoury",
    email: "jad.khoury@library.test",
    role: "admin",
    status: "active",
    joinedOn: "2024-09-23T00:00:00.000Z",
    membershipLabel: "Catalog manager",
    profileNote:
      "Staff account responsible for catalog quality, fee reviews, and metadata updates across the collection.",
  },
  {
    id: "omar-haddad",
    fullName: "Omar Haddad",
    email: "omar.haddad@library.test",
    role: "admin",
    status: "active",
    joinedOn: "2024-06-09T00:00:00.000Z",
    membershipLabel: "Operations lead",
    profileNote:
      "Operations lead overseeing borrowings approvals, overdue recovery, and member account health.",
  },
];

export const adminSharedBooks: ReadonlyArray<AdminSharedBookRecord> = [
  {
    id: "1984",
    title: "1984",
    author: "George Orwell",
    categoryId: "fiction",
    shelfCode: "FIC-19",
    feeCents: 0,
    coverTone: "brand",
    coverLabel: "1984",
    coverImageFileName: "1984-front-cover.jpg",
    isbn: "978-0-452-28423-4",
    description:
      "A high-circulation classic used in school reading lists and staff recommendation tables, with no cash fee required.",
    predefinedDurations: [7, 14, 21],
    allowCustomDuration: true,
    metadata: {
      edition: "Centennial edition",
      language: "English",
      publishedYear: "1949",
      publisher: "Secker & Warburg",
    },
    recordStatus: "active",
  },
  {
    id: "brief-history-time",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    categoryId: "science",
    shelfCode: "SCI-08",
    feeCents: 350,
    coverTone: "ocean",
    coverLabel: "Time",
    coverImageFileName: "brief-history-time-cover.png",
    isbn: "978-0-553-10953-5",
    description:
      "A steady-reservation science title often used to test custom duration reviews and onsite-cash payment handling.",
    predefinedDurations: [14, 21],
    allowCustomDuration: true,
    metadata: {
      edition: "Updated paperback",
      language: "English",
      publishedYear: "1988",
      publisher: "Bantam Books",
    },
    recordStatus: "active",
  },
  {
    id: "clean-code",
    title: "Clean Code",
    author: "Robert C. Martin",
    categoryId: "technology",
    shelfCode: "TEC-14",
    feeCents: 250,
    coverTone: "stone",
    coverLabel: "Code",
    coverImageFileName: "clean-code-cover.jpg",
    isbn: "978-0-13-235088-4",
    description:
      "A technical staple held in the software shelf rotation with a moderate onsite cash fee for extended circulation.",
    predefinedDurations: [14, 21, 28],
    allowCustomDuration: true,
    metadata: {
      edition: "First edition",
      language: "English",
      publishedYear: "2008",
      publisher: "Prentice Hall",
    },
    recordStatus: "active",
  },
  {
    id: "into-the-wild",
    title: "Into the Wild",
    author: "Jon Krakauer",
    categoryId: "travel",
    shelfCode: "TRV-02",
    feeCents: 150,
    coverTone: "forest",
    coverLabel: "Wild",
    coverImageFileName: "into-the-wild-cover.jpg",
    isbn: "978-0-385-48680-4",
    description:
      "A travel memoir kept active for browsing displays, with light-fee circulation and regular renewals.",
    predefinedDurations: [7, 14],
    allowCustomDuration: true,
    metadata: {
      edition: "Anchor Books",
      language: "English",
      publishedYear: "1997",
      publisher: "Villard",
    },
    recordStatus: "active",
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    categoryId: "philosophy",
    shelfCode: "PHI-03",
    feeCents: 0,
    coverTone: "amber",
    coverLabel: "Mind",
    coverImageFileName: "meditations-cover.jpg",
    isbn: "978-0-8129-7468-0",
    description:
      "A philosophy mainstay with frequent long-loan requests and no borrowing fee attached.",
    predefinedDurations: [14, 21],
    allowCustomDuration: false,
    metadata: {
      edition: "Modern Library Classics",
      language: "English",
      publishedYear: "2002",
      publisher: "Modern Library",
    },
    recordStatus: "active",
  },
  {
    id: "sapiens",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    categoryId: "history",
    shelfCode: "HIS-21",
    feeCents: 200,
    coverTone: "rose",
    coverLabel: "Past",
    coverImageFileName: "sapiens-cover.jpg",
    isbn: "978-0-06-231609-7",
    description:
      "A broad-audience history title with regular holds, moderate fees, and multi-copy stock across branches.",
    predefinedDurations: [14, 21, 28],
    allowCustomDuration: true,
    metadata: {
      edition: "Illustrated edition",
      language: "English",
      publishedYear: "2015",
      publisher: "Harper",
    },
    recordStatus: "active",
  },
  {
    id: "thinking-fast-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    categoryId: "business",
    shelfCode: "BUS-07",
    feeCents: 300,
    coverTone: "brand",
    coverLabel: "Mindset",
    coverImageFileName: "thinking-fast-slow-cover.jpg",
    isbn: "978-0-374-27563-1",
    description:
      "A business and psychology crossover title used heavily in leadership reading lists and staff recommendations.",
    predefinedDurations: [14, 21],
    allowCustomDuration: true,
    metadata: {
      edition: "First paperback",
      language: "English",
      publishedYear: "2011",
      publisher: "Farrar, Straus and Giroux",
    },
    recordStatus: "active",
  },
  {
    id: "ways-seeing",
    title: "Ways of Seeing",
    author: "John Berger",
    categoryId: "art-design",
    shelfCode: "ART-11",
    feeCents: 100,
    coverTone: "rose",
    coverLabel: "Seeing",
    coverImageFileName: "ways-seeing-cover.jpg",
    isbn: "978-0-14-013515-2",
    description:
      "An art and visual culture title used for coursework and display planning, currently kept inactive for catalog cleanup.",
    predefinedDurations: [7, 14],
    allowCustomDuration: false,
    metadata: {
      edition: "Penguin Modern Classics",
      language: "English",
      publishedYear: "1972",
      publisher: "BBC / Penguin",
    },
    recordStatus: "inactive",
  },
  {
    id: "lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    categoryId: "business",
    shelfCode: "BUS-12",
    feeCents: 200,
    coverTone: "ocean",
    coverLabel: "Lean",
    coverImageFileName: "lean-startup-cover.jpg",
    isbn: "978-0-307-88789-4",
    description:
      "A business title with moderate demand and steady circulation among entrepreneurship reading groups.",
    predefinedDurations: [14, 21],
    allowCustomDuration: false,
    metadata: {
      edition: "Crown Business",
      language: "English",
      publishedYear: "2011",
      publisher: "Crown Business",
    },
    recordStatus: "active",
  },
  {
    id: "the-odyssey",
    title: "The Odyssey",
    author: "Homer",
    categoryId: "fiction",
    shelfCode: "FIC-11",
    feeCents: 0,
    coverTone: "brand",
    coverLabel: "Odyssey",
    coverImageFileName: "odyssey-cover.jpg",
    isbn: "978-0-14-026886-7",
    description:
      "A classic literature staple with recurring classroom demand and no borrowing fee.",
    predefinedDurations: [14, 21],
    allowCustomDuration: false,
    metadata: {
      edition: "Penguin Classics",
      language: "English",
      publishedYear: "1996",
      publisher: "Penguin",
    },
    recordStatus: "active",
  },
  {
    id: "dune",
    title: "Dune",
    author: "Frank Herbert",
    categoryId: "fiction",
    shelfCode: "FIC-27",
    feeCents: 300,
    coverTone: "amber",
    coverLabel: "Dune",
    coverImageFileName: "dune-cover.jpg",
    isbn: "978-0-441-17271-9",
    description:
      "A science-fiction favorite with long-loan demand and regular reader-club borrowing spikes.",
    predefinedDurations: [14, 21, 28],
    allowCustomDuration: true,
    metadata: {
      edition: "Ace paperback",
      language: "English",
      publishedYear: "1965",
      publisher: "Chilton Books",
    },
    recordStatus: "active",
  },
  {
    id: "invisible-cities",
    title: "Invisible Cities",
    author: "Italo Calvino",
    categoryId: "travel",
    shelfCode: "TRV-05",
    feeCents: 0,
    coverTone: "forest",
    coverLabel: "Cities",
    coverImageFileName: "invisible-cities-cover.jpg",
    isbn: "978-0-15-645380-6",
    description:
      "A literary travel title favored for browsing displays and free short-loan circulation.",
    predefinedDurations: [14],
    allowCustomDuration: false,
    metadata: {
      edition: "Harvest Books",
      language: "English",
      publishedYear: "1974",
      publisher: "Harcourt",
    },
    recordStatus: "active",
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    categoryId: "business",
    shelfCode: "BUS-15",
    feeCents: 250,
    coverTone: "ocean",
    coverLabel: "Habits",
    coverImageFileName: "atomic-habits-cover.jpg",
    isbn: "978-0-7352-1129-2",
    description:
      "A high-turnover habits title that routinely needs fee confirmation and shelf balancing.",
    predefinedDurations: [14, 21],
    allowCustomDuration: false,
    metadata: {
      edition: "Avery first edition",
      language: "English",
      publishedYear: "2018",
      publisher: "Avery",
    },
    recordStatus: "active",
  },
  {
    id: "design-everyday-things",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    categoryId: "art-design",
    shelfCode: "ART-19",
    feeCents: 150,
    coverTone: "stone",
    coverLabel: "Design",
    coverImageFileName: "design-everyday-things-cover.jpg",
    isbn: "978-0-465-05065-9",
    description:
      "A design systems and product thinking staple used in studio and product teams' reading rotations.",
    predefinedDurations: [14, 21],
    allowCustomDuration: true,
    metadata: {
      edition: "Revised and expanded",
      language: "English",
      publishedYear: "2013",
      publisher: "Basic Books",
    },
    recordStatus: "active",
  },
  {
    id: "beloved",
    title: "Beloved",
    author: "Toni Morrison",
    categoryId: "fiction",
    shelfCode: "FIC-32",
    feeCents: 0,
    coverTone: "rose",
    coverLabel: "Beloved",
    coverImageFileName: "beloved-cover.jpg",
    isbn: "978-1-4000-3341-6",
    description:
      "A literary fiction title with recurring book-club demand and free standard circulation.",
    predefinedDurations: [14, 21],
    allowCustomDuration: false,
    metadata: {
      edition: "Vintage International",
      language: "English",
      publishedYear: "1987",
      publisher: "Knopf",
    },
    recordStatus: "active",
  },
  {
    id: "art-of-war",
    title: "The Art of War",
    author: "Sun Tzu",
    categoryId: "history",
    shelfCode: "HIS-09",
    feeCents: 0,
    coverTone: "stone",
    coverLabel: "War",
    coverImageFileName: "art-of-war-cover.jpg",
    isbn: "978-0-14-310575-6",
    description:
      "A compact strategy classic that circulates in history and leadership reading lists without a fee.",
    predefinedDurations: [7, 14],
    allowCustomDuration: false,
    metadata: {
      edition: "Penguin Classics",
      language: "English",
      publishedYear: "2005",
      publisher: "Penguin",
    },
    recordStatus: "active",
  },
];

export const adminSharedInventoryCopies: ReadonlyArray<AdminSharedInventoryCopyRecord> = [
  {
    id: "copy-1984-01",
    bookId: "1984",
    copyCode: "DT-FIC-1984-01",
    branch: "Downtown",
    shelfLabel: "Shelf F3",
    condition: "good",
    status: "available",
    locationNote: "Front fiction bay",
    updatedOn: "2026-04-03T08:45:00.000Z",
  },
  {
    id: "copy-1984-02",
    bookId: "1984",
    copyCode: "DT-FIC-1984-02",
    branch: "Downtown",
    shelfLabel: "Shelf F3",
    condition: "fair",
    status: "borrowed",
    locationNote: "Assigned to Dana Hage",
    updatedOn: "2026-04-02T10:15:00.000Z",
  },
  {
    id: "copy-1984-03",
    bookId: "1984",
    copyCode: "HM-FIC-1984-03",
    branch: "Hamra",
    shelfLabel: "Shelf F1",
    condition: "good",
    status: "available",
    locationNote: "Available for pending requests",
    updatedOn: "2026-04-01T09:30:00.000Z",
  },
  {
    id: "copy-time-01",
    bookId: "brief-history-time",
    copyCode: "HM-SCI-BHT-01",
    branch: "Hamra",
    shelfLabel: "Science Annex S1",
    condition: "new",
    status: "available",
    locationNote: "Reserved for staff review queue",
    updatedOn: "2026-04-03T07:10:00.000Z",
  },
  {
    id: "copy-time-02",
    bookId: "brief-history-time",
    copyCode: "HM-SCI-BHT-02",
    branch: "Hamra",
    shelfLabel: "Science Annex S1",
    condition: "good",
    status: "maintenance",
    locationNote: "Dust-jacket replacement scheduled",
    updatedOn: "2026-04-02T13:40:00.000Z",
  },
  {
    id: "copy-clean-code-01",
    bookId: "clean-code",
    copyCode: "DT-TEC-CLC-01",
    branch: "Downtown",
    shelfLabel: "Technology T2",
    condition: "good",
    status: "borrowed",
    locationNote: "Assigned to Sara Chehab",
    updatedOn: "2026-03-30T11:00:00.000Z",
  },
  {
    id: "copy-clean-code-02",
    bookId: "clean-code",
    copyCode: "DT-TEC-CLC-02",
    branch: "Downtown",
    shelfLabel: "Technology T2",
    condition: "good",
    status: "available",
    locationNote: "Reference shelf backup copy",
    updatedOn: "2026-04-02T15:20:00.000Z",
  },
  {
    id: "copy-wild-01",
    bookId: "into-the-wild",
    copyCode: "BY-TRV-WLD-01",
    branch: "Byblos",
    shelfLabel: "Travel T1",
    condition: "good",
    status: "borrowed",
    locationNote: "Assigned to Noor Haddad",
    updatedOn: "2026-04-01T12:00:00.000Z",
  },
  {
    id: "copy-wild-02",
    bookId: "into-the-wild",
    copyCode: "BY-TRV-WLD-02",
    branch: "Byblos",
    shelfLabel: "Travel T1",
    condition: "good",
    status: "available",
    locationNote: "Display copy",
    updatedOn: "2026-04-03T08:00:00.000Z",
  },
  {
    id: "copy-mediations-01",
    bookId: "meditations",
    copyCode: "DT-PHI-MED-01",
    branch: "Downtown",
    shelfLabel: "Philosophy P2",
    condition: "fair",
    status: "borrowed",
    locationNote: "Assigned to Rami Nader",
    updatedOn: "2026-03-21T09:15:00.000Z",
  },
  {
    id: "copy-mediations-02",
    bookId: "meditations",
    copyCode: "DT-PHI-MED-02",
    branch: "Downtown",
    shelfLabel: "Philosophy P2",
    condition: "good",
    status: "available",
    locationNote: "Available on shelf",
    updatedOn: "2026-04-03T10:30:00.000Z",
  },
  {
    id: "copy-sapiens-01",
    bookId: "sapiens",
    copyCode: "HM-HIS-SAP-01",
    branch: "Hamra",
    shelfLabel: "History H4",
    condition: "good",
    status: "borrowed",
    locationNote: "Assigned to Lina Saad",
    updatedOn: "2026-03-12T14:25:00.000Z",
  },
  {
    id: "copy-sapiens-02",
    bookId: "sapiens",
    copyCode: "HM-HIS-SAP-02",
    branch: "Hamra",
    shelfLabel: "History H4",
    condition: "good",
    status: "available",
    locationNote: "Shelf copy",
    updatedOn: "2026-04-02T08:15:00.000Z",
  },
  {
    id: "copy-sapiens-03",
    bookId: "sapiens",
    copyCode: "HM-HIS-SAP-03",
    branch: "Hamra",
    shelfLabel: "History H4",
    condition: "poor",
    status: "maintenance",
    locationNote: "Binding repair queued",
    updatedOn: "2026-04-03T06:55:00.000Z",
  },
  {
    id: "copy-thinking-01",
    bookId: "thinking-fast-slow",
    copyCode: "DT-BUS-TFS-01",
    branch: "Downtown",
    shelfLabel: "Business B2",
    condition: "good",
    status: "available",
    locationNote: "Leadership shelf",
    updatedOn: "2026-04-01T16:20:00.000Z",
  },
  {
    id: "copy-ways-01",
    bookId: "ways-seeing",
    copyCode: "AR-ART-WSG-01",
    branch: "Arts Room",
    shelfLabel: "Visual Culture V1",
    condition: "fair",
    status: "available",
    locationNote: "Pending catalog status review",
    updatedOn: "2026-04-02T11:30:00.000Z",
  },
  {
    id: "copy-ways-02",
    bookId: "ways-seeing",
    copyCode: "AR-ART-WSG-02",
    branch: "Arts Room",
    shelfLabel: "Visual Culture V1",
    condition: "poor",
    status: "maintenance",
    locationNote: "Cover lamination replacement",
    updatedOn: "2026-04-03T09:05:00.000Z",
  },
  {
    id: "copy-lean-01",
    bookId: "lean-startup",
    copyCode: "DT-BUS-LST-01",
    branch: "Downtown",
    shelfLabel: "Business B4",
    condition: "good",
    status: "available",
    locationNote: "Startup reading list",
    updatedOn: "2026-03-31T15:50:00.000Z",
  },
  {
    id: "copy-odyssey-01",
    bookId: "the-odyssey",
    copyCode: "HM-FIC-ODY-01",
    branch: "Hamra",
    shelfLabel: "Classics C3",
    condition: "good",
    status: "available",
    locationNote: "Classics shelf",
    updatedOn: "2026-03-29T13:10:00.000Z",
  },
  {
    id: "copy-dune-01",
    bookId: "dune",
    copyCode: "DT-FIC-DUN-01",
    branch: "Downtown",
    shelfLabel: "Science Fiction S2",
    condition: "new",
    status: "available",
    locationNote: "Reader club hold shelf",
    updatedOn: "2026-04-03T09:50:00.000Z",
  },
  {
    id: "copy-cities-01",
    bookId: "invisible-cities",
    copyCode: "BY-TRV-ICT-01",
    branch: "Byblos",
    shelfLabel: "Travel T2",
    condition: "good",
    status: "borrowed",
    locationNote: "Assigned to Maya Sayegh",
    updatedOn: "2026-04-01T10:40:00.000Z",
  },
  {
    id: "copy-cities-02",
    bookId: "invisible-cities",
    copyCode: "BY-TRV-ICT-02",
    branch: "Byblos",
    shelfLabel: "Travel T2",
    condition: "good",
    status: "available",
    locationNote: "Available for walk-ins",
    updatedOn: "2026-04-02T14:05:00.000Z",
  },
  {
    id: "copy-atomic-01",
    bookId: "atomic-habits",
    copyCode: "DT-BUS-ATH-01",
    branch: "Downtown",
    shelfLabel: "Business B1",
    condition: "good",
    status: "available",
    locationNote: "Return processed this week",
    updatedOn: "2026-03-22T09:00:00.000Z",
  },
  {
    id: "copy-design-01",
    bookId: "design-everyday-things",
    copyCode: "AR-ART-DOT-01",
    branch: "Arts Room",
    shelfLabel: "Design D2",
    condition: "good",
    status: "available",
    locationNote: "Ready for pending pickup",
    updatedOn: "2026-04-03T08:35:00.000Z",
  },
  {
    id: "copy-beloved-01",
    bookId: "beloved",
    copyCode: "DT-FIC-BLV-01",
    branch: "Downtown",
    shelfLabel: "Literature L1",
    condition: "good",
    status: "available",
    locationNote: "Book club shelf",
    updatedOn: "2026-03-20T10:00:00.000Z",
  },
  {
    id: "copy-war-01",
    bookId: "art-of-war",
    copyCode: "HM-HIS-AOW-01",
    branch: "Hamra",
    shelfLabel: "History H2",
    condition: "good",
    status: "available",
    locationNote: "Strategy shelf",
    updatedOn: "2026-03-18T12:00:00.000Z",
  },
];

export const adminSharedBorrowings: ReadonlyArray<AdminSharedBorrowingRecord> = [
  {
    id: "borrowing-brief-time-maya-pending",
    bookId: "brief-history-time",
    userId: "maya-sayegh",
    branch: "Hamra",
    durationDays: 21,
    customDuration: true,
    feeCents: 350,
    paymentStatus: "cash-due",
    requestedOn: "2026-04-03T09:10:00.000Z",
    status: "pending",
    note: "Extended duration requested for research review.",
  },
  {
    id: "borrowing-ways-rana-pending",
    bookId: "ways-seeing",
    userId: "rana-azar",
    branch: "Arts Room",
    durationDays: 7,
    customDuration: false,
    feeCents: 100,
    paymentStatus: "cash-due",
    requestedOn: "2026-04-02T14:40:00.000Z",
    status: "pending",
    note: "Pickup approval pending after catalog status review.",
  },
  {
    id: "borrowing-design-noor-pending",
    bookId: "design-everyday-things",
    userId: "noor-haddad",
    branch: "Arts Room",
    durationDays: 14,
    customDuration: false,
    feeCents: 150,
    paymentStatus: "cash-due",
    requestedOn: "2026-04-01T15:20:00.000Z",
    status: "pending",
    note: "Requested for an upcoming design workshop session.",
  },
  {
    id: "borrowing-clean-sara-active",
    bookId: "clean-code",
    userId: "sara-chehab",
    branch: "Downtown",
    durationDays: 21,
    customDuration: true,
    feeCents: 250,
    paymentStatus: "cash-due",
    requestedOn: "2026-03-29T08:20:00.000Z",
    startedOn: "2026-03-30T09:00:00.000Z",
    status: "active",
    note: "Custom duration approved for final-year project work.",
  },
  {
    id: "borrowing-1984-dana-active",
    bookId: "1984",
    userId: "dana-hage",
    branch: "Downtown",
    durationDays: 14,
    customDuration: false,
    feeCents: 0,
    paymentStatus: "not-required",
    requestedOn: "2026-04-01T09:05:00.000Z",
    startedOn: "2026-04-02T10:30:00.000Z",
    status: "active",
    note: "Collected from the Downtown circulation desk.",
  },
  {
    id: "borrowing-cities-maya-active",
    bookId: "invisible-cities",
    userId: "maya-sayegh",
    branch: "Byblos",
    durationDays: 14,
    customDuration: false,
    feeCents: 0,
    paymentStatus: "not-required",
    requestedOn: "2026-03-31T11:10:00.000Z",
    startedOn: "2026-04-01T10:40:00.000Z",
    status: "active",
    note: "Part of the current travel-reading display rotation.",
  },
  {
    id: "borrowing-wild-noor-active",
    bookId: "into-the-wild",
    userId: "noor-haddad",
    branch: "Byblos",
    durationDays: 14,
    customDuration: false,
    feeCents: 150,
    paymentStatus: "cash-due",
    requestedOn: "2026-03-31T12:15:00.000Z",
    startedOn: "2026-04-01T12:00:00.000Z",
    status: "active",
    note: "Cash is collected onsite at pickup for travel shelf titles.",
  },
  {
    id: "borrowing-sapiens-lina-overdue",
    bookId: "sapiens",
    userId: "lina-saad",
    branch: "Hamra",
    durationDays: 14,
    customDuration: false,
    feeCents: 200,
    paymentStatus: "cash-due",
    requestedOn: "2026-03-11T09:00:00.000Z",
    startedOn: "2026-03-12T14:25:00.000Z",
    status: "overdue",
    note: "Follow-up initiated after the return window was missed.",
  },
  {
    id: "borrowing-meditations-rami-overdue",
    bookId: "meditations",
    userId: "rami-nader",
    branch: "Downtown",
    durationDays: 10,
    customDuration: false,
    feeCents: 0,
    paymentStatus: "not-required",
    requestedOn: "2026-03-20T10:00:00.000Z",
    startedOn: "2026-03-21T09:15:00.000Z",
    status: "overdue",
    note: "Reader reminder sent after the due window closed.",
  },
  {
    id: "borrowing-time-sara-returned",
    bookId: "brief-history-time",
    userId: "sara-chehab",
    branch: "Hamra",
    durationDays: 14,
    customDuration: false,
    feeCents: 350,
    paymentStatus: "cash-settled",
    requestedOn: "2026-03-04T09:30:00.000Z",
    startedOn: "2026-03-06T10:00:00.000Z",
    returnedOn: "2026-03-20T16:15:00.000Z",
    status: "returned",
    note: "Cash fee settled onsite at return.",
  },
  {
    id: "borrowing-atomic-maya-returned",
    bookId: "atomic-habits",
    userId: "maya-sayegh",
    branch: "Downtown",
    durationDays: 14,
    customDuration: false,
    feeCents: 250,
    paymentStatus: "cash-settled",
    requestedOn: "2026-03-07T11:00:00.000Z",
    startedOn: "2026-03-08T09:20:00.000Z",
    returnedOn: "2026-03-22T13:40:00.000Z",
    status: "returned",
  },
  {
    id: "borrowing-dune-rami-returned",
    bookId: "dune",
    userId: "rami-nader",
    branch: "Downtown",
    durationDays: 14,
    customDuration: false,
    feeCents: 300,
    paymentStatus: "cash-settled",
    requestedOn: "2026-02-24T10:30:00.000Z",
    startedOn: "2026-02-26T12:15:00.000Z",
    returnedOn: "2026-03-12T10:20:00.000Z",
    status: "returned",
  },
  {
    id: "borrowing-odyssey-lina-returned",
    bookId: "the-odyssey",
    userId: "lina-saad",
    branch: "Hamra",
    durationDays: 7,
    customDuration: false,
    feeCents: 0,
    paymentStatus: "not-required",
    requestedOn: "2026-01-07T10:00:00.000Z",
    startedOn: "2026-01-08T09:00:00.000Z",
    returnedOn: "2026-01-15T12:30:00.000Z",
    status: "returned",
  },
  {
    id: "borrowing-beloved-dana-returned",
    bookId: "beloved",
    userId: "dana-hage",
    branch: "Downtown",
    durationDays: 14,
    customDuration: false,
    feeCents: 0,
    paymentStatus: "not-required",
    requestedOn: "2026-02-05T11:45:00.000Z",
    startedOn: "2026-02-06T10:30:00.000Z",
    returnedOn: "2026-02-24T15:10:00.000Z",
    status: "returned",
  },
];

export const adminSharedActivities: ReadonlyArray<AdminSharedActivityRecord> = [
  {
    id: "activity-pending-review",
    title: "Pending request cluster reviewed",
    description:
      "Three pickup requests were routed into the midday approval queue, including one extended-duration science title.",
    actorUserId: "omar-haddad",
    actorRoleLabel: "Operations lead",
    occurredOn: "2026-04-03T11:35:00.000Z",
    statusLabel: "Pending",
    statusTone: "warning",
  },
  {
    id: "activity-maintenance-ways-seeing",
    title: "Design copy moved to maintenance",
    description:
      "One copy of Ways of Seeing was marked for cover replacement before it can re-enter circulation.",
    actorUserId: "jad-khoury",
    actorRoleLabel: "Catalog manager",
    occurredOn: "2026-04-03T10:20:00.000Z",
    statusLabel: "Updated",
    statusTone: "info",
  },
  {
    id: "activity-lina-follow-up",
    title: "Overdue account escalated",
    description:
      "Lina Saad was moved into suspension while overdue recovery and onsite cash settlement remain open.",
    actorUserId: "omar-haddad",
    actorRoleLabel: "Operations lead",
    occurredOn: "2026-04-03T09:05:00.000Z",
    statusLabel: "Needs review",
    statusTone: "danger",
  },
  {
    id: "activity-cash-return",
    title: "Cash settlement recorded on return",
    description:
      "Sara Chehab completed a return for A Brief History of Time and settled the onsite circulation fee.",
    actorUserId: "jad-khoury",
    actorRoleLabel: "Catalog manager",
    occurredOn: "2026-04-02T16:10:00.000Z",
    statusLabel: "Resolved",
    statusTone: "success",
  },
];

export const adminSharedCategoryMap = new Map(
  adminSharedCategories.map((category) => [category.id, category]),
);

export const adminSharedBookMap = new Map(
  adminSharedBooks.map((book) => [book.id, book]),
);

export const adminSharedUserMap = new Map(
  adminSharedUsers.map((user) => [user.id, user]),
);

export function getAdminSharedCategory(categoryId: AdminSharedCategoryId) {
  return adminSharedCategoryMap.get(categoryId);
}

export function getAdminSharedBook(bookId: string) {
  return adminSharedBookMap.get(bookId);
}

export function getAdminSharedUser(userId: string) {
  return adminSharedUserMap.get(userId);
}

export function getAdminSharedInventoryCopiesForBook(bookId: string) {
  return adminSharedInventoryCopies.filter((copy) => copy.bookId === bookId);
}

export function getAdminSharedBorrowingsForBook(bookId: string) {
  return adminSharedBorrowings.filter((record) => record.bookId === bookId);
}

export function getAdminSharedBorrowingsForUser(userId: string) {
  return adminSharedBorrowings.filter((record) => record.userId === userId);
}

export function getAdminSharedBookCountByCategory(categoryId: AdminSharedCategoryId) {
  return adminSharedBooks.filter((book) => book.categoryId === categoryId).length;
}

export function getAdminSharedBookInventorySummary(bookId: string) {
  const copies = getAdminSharedInventoryCopiesForBook(bookId);
  const borrowings = getAdminSharedBorrowingsForBook(bookId);

  return {
    availableCopies: copies.filter((copy) => copy.status === "available").length,
    borrowedCopies: copies.filter((copy) => copy.status === "borrowed").length,
    lastAuditLabel: copies.length > 0
      ? formatAdminRelativeAuditLabel(
          copies
            .slice()
            .sort((left, right) => right.updatedOn.localeCompare(left.updatedOn))[0]
            .updatedOn,
        )
      : "Awaiting first audit",
    reservedCopies: borrowings.filter((record) => record.status === "pending").length,
    shelfCode: getAdminSharedBook(bookId)?.shelfCode ?? "Unassigned",
    totalCopies: copies.length,
  };
}

export function getAdminSharedDueDate(record: AdminSharedBorrowingRecord) {
  if (!record.startedOn) {
    return undefined;
  }

  return new Date(
    toUtcDate(record.startedOn).getTime() + record.durationDays * 24 * 60 * 60 * 1000,
  ).toISOString();
}

export function getAdminSharedPaymentLabel(status: AdminSharedPaymentStatus) {
  switch (status) {
    case "cash-due":
      return "Cash due onsite";
    case "cash-settled":
      return "Cash settled";
    default:
      return "No fee";
  }
}

export function getAdminSharedWeekdayLabel(value: string) {
  return padNumber(toUtcDate(value).getUTCDate());
}