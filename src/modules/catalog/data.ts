export type CatalogStatusTone = "success" | "warning" | "danger";

export interface CatalogBook {
  title: string;
  author: string;
  category: string;
  availability: string;
  statusLabel: string;
  statusTone: CatalogStatusTone;
  feeLabel: string;
}

export interface SnapshotItem {
  title: string;
  description: string;
  meta: string;
}

export interface ProfileItem {
  label: string;
  value: string;
}

export const catalogCategories = [
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

export const catalogBooks: ReadonlyArray<CatalogBook> = [
  {
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    availability: "4/6 available",
    statusLabel: "Free",
    statusTone: "success",
    feeLabel: "$2.50",
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    availability: "1/3 available",
    statusLabel: "Popular",
    statusTone: "warning",
    feeLabel: "$3.50",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    availability: "1/3 available",
    statusLabel: "Free",
    statusTone: "success",
    feeLabel: "$0.00",
  },
  {
    title: "Into the Wild",
    author: "Jon Krakauer",
    category: "Travel",
    availability: "3/3 available",
    statusLabel: "Ready",
    statusTone: "success",
    feeLabel: "$1.50",
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    category: "Philosophy",
    availability: "0/2 available",
    statusLabel: "Unavailable",
    statusTone: "danger",
    feeLabel: "$2.00",
  },
  {
    title: "Salt, Fat, Acid, Heat",
    author: "Samin Nosrat",
    category: "Art & Design",
    availability: "2/3 available",
    statusLabel: "Staff Pick",
    statusTone: "warning",
    feeLabel: "$3.00",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    availability: "2/4 available",
    statusLabel: "Trending",
    statusTone: "warning",
    feeLabel: "$1.00",
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    category: "History",
    availability: "1/4 available",
    statusLabel: "Free",
    statusTone: "success",
    feeLabel: "$0.00",
  },
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    category: "Art & Design",
    availability: "3/4 available",
    statusLabel: "Free",
    statusTone: "success",
    feeLabel: "$0.00",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    availability: "3/5 available",
    statusLabel: "Free",
    statusTone: "success",
    feeLabel: "$0.00",
  },
  {
    title: "The Poetry of Rumi",
    author: "Jalal ad-Din Rumi",
    category: "Philosophy",
    availability: "5/5 available",
    statusLabel: "Available",
    statusTone: "success",
    feeLabel: "$2.00",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "Business",
    availability: "2/4 available",
    statusLabel: "Featured",
    statusTone: "warning",
    feeLabel: "$2.25",
  },
];

export const borrowingSnapshots: ReadonlyArray<SnapshotItem> = [
  {
    title: "Due soon",
    description: "The Design of Everyday Things",
    meta: "Return in 2 days",
  },
  {
    title: "Ready for pickup",
    description: "Sapiens: A Brief History of Humankind",
    meta: "Reserved at Central Branch",
  },
  {
    title: "Saved for later",
    description: "Meditations",
    meta: "Notify when available",
  },
];

export const profileHighlights: ReadonlyArray<ProfileItem> = [
  { label: "Preferred branch", value: "Downtown Reading Room" },
  { label: "Membership", value: "Community plan" },
  { label: "Notifications", value: "Email and SMS reminders" },
  { label: "Pickup window", value: "Weekdays after 5 PM" },
];
