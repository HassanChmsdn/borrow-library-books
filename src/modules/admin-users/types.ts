export type AdminUserRole = "user" | "admin";

export type AdminUserStatus = "active" | "suspended";

export type AdminUsersRoleFilter = "all" | AdminUserRole;

export type AdminUserBorrowingStatus =
  | "active"
  | "overdue"
  | "returned"
  | "pending";

export type AdminUserPaymentStatus =
  | "cash-due"
  | "cash-settled"
  | "not-required";

export interface AdminUserRecord {
  borrowingSummaryLabel: string;
  borrowingSummaryMeta: string;
  email: string;
  fullName: string;
  id: string;
  joinedDateLabel: string;
  profileHref: string;
  role: AdminUserRole;
  status: AdminUserStatus;
}

export interface AdminUserBorrowingRecord {
  bookAuthor: string;
  bookHref?: string;
  bookTitle: string;
  completedDateLabel?: string;
  customDurationRequested?: boolean;
  dueDateLabel?: string;
  durationLabel: string;
  feeLabel: string;
  id: string;
  note?: string;
  paymentStatus: AdminUserPaymentStatus;
  startedDateLabel: string;
  status: AdminUserBorrowingStatus;
}

export interface AdminUserProfileRecord extends AdminUserRecord {
  activeBorrowingsCount: number;
  borrowingHistory: ReadonlyArray<AdminUserBorrowingRecord>;
  currentBorrowings: ReadonlyArray<AdminUserBorrowingRecord>;
  overdueCount: number;
  profileSummaryNote: string;
  totalBorrowingsCount: number;
}

export interface AdminUsersModuleProps {
  isLoading?: boolean;
  records?: ReadonlyArray<AdminUserRecord>;
}

export interface AdminUserProfileModuleProps {
  initialUser?: AdminUserProfileRecord;
  isLoading?: boolean;
}
