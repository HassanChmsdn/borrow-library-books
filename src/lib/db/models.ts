import type { ObjectId } from "mongodb";

export type AppUserRole = "member" | "admin";

export type AppUserStatus = "active" | "suspended";

export type BookStatus = "active" | "inactive";

export type BookCopyCondition = "new" | "good" | "fair" | "poor";

export type BookCopyStatus = "available" | "reserved" | "borrowed" | "maintenance";

export type BorrowRequestStatus =
  | "draft"
  | "pending"
  | "active"
  | "overdue"
  | "returned"
  | "cancelled";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "waived";

export interface BaseDocument {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends BaseDocument {
  authProvider: "auth0" | "mock";
  authSubject: string;
  email: string;
  fullName: string;
  role: AppUserRole;
  status: AppUserStatus;
  avatarUrl?: string;
  lastLoginAt?: Date;
}

export interface CategoryDocument extends BaseDocument {
  description?: string;
  name: string;
  slug: string;
}

export interface BookDocument extends BaseDocument {
  allowCustomDuration: boolean;
  author: string;
  categoryId: ObjectId | string;
  coverImageUrl?: string;
  description: string;
  feeCents: number;
  isbn: string;
  metadata?: {
    edition?: string;
    language?: string;
    publishedYear?: string;
    publisher?: string;
  };
  predefinedDurations: number[];
  status: BookStatus;
  title: string;
}

export interface BookCopyDocument extends BaseDocument {
  bookId: ObjectId | string;
  condition: BookCopyCondition;
  copyCode: string;
  notes?: string;
  status: BookCopyStatus;
}

export interface BorrowRequestDocument extends BaseDocument {
  approvedAt?: Date;
  bookCopyId?: ObjectId | string;
  bookId: ObjectId | string;
  dueAt?: Date;
  notes?: string;
  paymentStatus: PaymentStatus;
  requestedAt: Date;
  requestedCustomDuration: boolean;
  requestedDurationDays: number;
  returnedAt?: Date;
  startedAt?: Date;
  status: BorrowRequestStatus;
  userId: ObjectId | string;
}