import {
  getAllBooksItemById,
  type AllBooksItem,
} from "@/modules/catalog/all-books-data";

type MyBorrowingsTab = "active" | "pending" | "returned" | "overdue";
type PaymentStatusTone = "success" | "warning" | "danger" | "info" | "neutral";

interface BorrowingPaymentStatus {
  label: string;
  tone: PaymentStatusTone;
}

interface BorrowingRecord {
  id: string;
  book: AllBooksItem;
  tab: MyBorrowingsTab;
  status:
    | "due-soon"
    | "ready-for-pickup"
    | "checked-out"
    | "returned"
    | "overdue";
  timelineLabel: string;
  timelineValue: string;
  supportingMeta: string;
  paymentStatus: BorrowingPaymentStatus;
}

const myBorrowingsTabs = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "returned", label: "Returned" },
  { value: "overdue", label: "Overdue" },
] as const;

function requireMockBook(bookId: string) {
  const book = getAllBooksItemById(bookId);

  if (!book) {
    throw new Error(
      `Missing mock catalog book for borrowing record: ${bookId}`,
    );
  }

  return book;
}

const myBorrowingsRecords: ReadonlyArray<BorrowingRecord> = [
  {
    id: "1984-active",
    book: requireMockBook("1984"),
    tab: "active",
    status: "checked-out",
    timelineLabel: "Due on",
    timelineValue: "Apr 14, 2026",
    supportingMeta: "Borrowed Mar 31, 2026 · Copy 2",
    paymentStatus: {
      label: "No payment due",
      tone: "neutral",
    },
  },
  {
    id: "sapiens-due-soon",
    book: requireMockBook("sapiens"),
    tab: "active",
    status: "due-soon",
    timelineLabel: "Due on",
    timelineValue: "Apr 5, 2026",
    supportingMeta: "Borrowed Mar 22, 2026 · Renewal available",
    paymentStatus: {
      label: "Paid onsite",
      tone: "success",
    },
  },
  {
    id: "meditations-pending",
    book: requireMockBook("meditations"),
    tab: "pending",
    status: "ready-for-pickup",
    timelineLabel: "Pickup by",
    timelineValue: "Apr 4, 2026",
    supportingMeta: "Reserved Apr 2, 2026 · Desk hold",
    paymentStatus: {
      label: "Cash due on pickup",
      tone: "warning",
    },
  },
  {
    id: "brief-history-overdue",
    book: requireMockBook("brief-history-of-time"),
    tab: "overdue",
    status: "overdue",
    timelineLabel: "Due on",
    timelineValue: "Mar 29, 2026",
    supportingMeta: "Borrowed Mar 8, 2026 · Return requested",
    paymentStatus: {
      label: "Cash due onsite",
      tone: "danger",
    },
  },
];

export {
  myBorrowingsRecords,
  myBorrowingsTabs,
  type BorrowingPaymentStatus,
  type BorrowingRecord,
  type MyBorrowingsTab,
  type PaymentStatusTone,
};
