import { ObjectId } from "mongodb";
import { z } from "zod";

import {
  APP_USER_ROLE_VALUES,
  AppUserRoleSchema,
  APP_USER_STATUS_VALUES,
  AppUserStatusSchema,
  MEMBER_APP_USER_ROLE,
  STAFF_APP_USER_ROLE_VALUES,
  type AppUserRole,
  type AppUserStatus,
  type StaffAppUserRole,
} from "../auth/app-user-model";

export {
  APP_USER_ROLE_VALUES,
  AppUserRoleSchema,
  APP_USER_STATUS_VALUES,
  AppUserStatusSchema,
  MEMBER_APP_USER_ROLE,
  STAFF_APP_USER_ROLE_VALUES,
  type AppUserRole,
  type AppUserStatus,
  type StaffAppUserRole,
};

export const BookStatusSchema = z.enum(["active", "inactive"]);
export type BookStatus = z.infer<typeof BookStatusSchema>;

export const BookCopyConditionSchema = z.enum(["new", "good", "fair", "poor"]);
export type BookCopyCondition = z.infer<typeof BookCopyConditionSchema>;

export const BookCopyStatusSchema = z.enum([
  "available",
  "reserved",
  "borrowed",
  "maintenance",
]);
export type BookCopyStatus = z.infer<typeof BookCopyStatusSchema>;

export const BorrowDurationTypeSchema = z.enum(["predefined", "custom"]);
export type BorrowDurationType = z.infer<typeof BorrowDurationTypeSchema>;

export const BorrowRequestStatusSchema = z.enum([
  "draft",
  "pending",
  "active",
  "overdue",
  "returned",
  "cancelled",
]);
export type BorrowRequestStatus = z.infer<typeof BorrowRequestStatusSchema>;

export const PaymentMethodSchema = z.enum(["onsite-cash"]);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const PaymentStatusSchema = z.enum(["unpaid", "pending", "paid", "waived"]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export type DatabaseId = ObjectId | string;

export const DatabaseIdSchema = z.union([
  z.string().trim().min(1),
  z.instanceof(ObjectId),
]) as z.ZodType<DatabaseId>;

export type UserId = DatabaseId;
export type CategoryId = DatabaseId;
export type BookId = DatabaseId;
export type BookCopyId = DatabaseId;
export type BorrowRequestId = DatabaseId;

export const BaseDocumentSchema = z.object({
  _id: DatabaseIdSchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type BaseDocument = z.infer<typeof BaseDocumentSchema>;

export const UserDocumentSchema = BaseDocumentSchema.extend({
  auth0UserId: z.string().trim().min(1),
  avatarUrl: z.string().trim().url().optional(),
  email: z.string().trim().toLowerCase().email(),
  lastLoginAt: z.date().optional(),
  name: z.string().trim().min(1).max(120),
  role: AppUserRoleSchema,
  status: AppUserStatusSchema,
});

export type UserDocument = z.infer<typeof UserDocumentSchema>;

export const CreateUserInputSchema = UserDocumentSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export const UpdateUserInputSchema = CreateUserInputSchema.partial();
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;

export const CategoryDocumentSchema = BaseDocumentSchema.extend({
  description: z.string().trim().max(500).optional(),
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(140),
});

export type CategoryDocument = z.infer<typeof CategoryDocumentSchema>;

export const CreateCategoryInputSchema = CategoryDocumentSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateCategoryInput = z.infer<typeof CreateCategoryInputSchema>;

export const UpdateCategoryInputSchema = CreateCategoryInputSchema.partial();
export type UpdateCategoryInput = z.infer<typeof UpdateCategoryInputSchema>;

export const BookPublicationMetadataSchema = z
  .object({
    edition: z.string().trim().max(80).optional(),
    language: z.string().trim().max(80).optional(),
    publishedYear: z.string().trim().max(4).optional(),
    publisher: z.string().trim().max(120).optional(),
  })
  .partial();

export type BookPublicationMetadata = z.infer<typeof BookPublicationMetadataSchema>;

export const BookDocumentSchema = BaseDocumentSchema.extend({
  allowCustomDuration: z.boolean(),
  author: z.string().trim().min(1).max(160),
  categoryId: DatabaseIdSchema,
  coverImageUrl: z.string().trim().url().optional(),
  description: z.string().trim().min(1).max(5000),
  feeCents: z.number().int().min(0),
  isbn: z.string().trim().min(10).max(20),
  metadata: BookPublicationMetadataSchema.optional(),
  predefinedDurations: z.array(z.number().int().positive()).min(1),
  status: BookStatusSchema,
  title: z.string().trim().min(1).max(220),
});

export type BookDocument = z.infer<typeof BookDocumentSchema>;

export const CreateBookInputSchema = BookDocumentSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateBookInput = z.infer<typeof CreateBookInputSchema>;

export const UpdateBookInputSchema = CreateBookInputSchema.partial();
export type UpdateBookInput = z.infer<typeof UpdateBookInputSchema>;

export const BookCopyDocumentSchema = BaseDocumentSchema.extend({
  bookId: DatabaseIdSchema,
  condition: BookCopyConditionSchema,
  copyCode: z.string().trim().min(1).max(80),
  notes: z.string().trim().max(1000).optional(),
  status: BookCopyStatusSchema,
});

export type BookCopyDocument = z.infer<typeof BookCopyDocumentSchema>;

export const CreateBookCopyInputSchema = BookCopyDocumentSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateBookCopyInput = z.infer<typeof CreateBookCopyInputSchema>;

export const UpdateBookCopyInputSchema = CreateBookCopyInputSchema.partial();
export type UpdateBookCopyInput = z.infer<typeof UpdateBookCopyInputSchema>;

export const BorrowRequestDocumentSchema = BaseDocumentSchema.extend({
  approvedDurationDays: z.number().int().positive().optional(),
  bookCopyId: DatabaseIdSchema,
  bookId: DatabaseIdSchema,
  cancelledAt: z.date().optional(),
  dueAt: z.date().optional(),
  durationType: BorrowDurationTypeSchema,
  feeCents: z.number().int().min(0),
  notes: z.string().trim().max(2000).optional(),
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema,
  rejectionReason: z.string().trim().max(500).optional(),
  requestedAt: z.date(),
  requestedDurationDays: z.number().int().positive(),
  returnedAt: z.date().optional(),
  reviewedAt: z.date().optional(),
  reviewedByUserId: DatabaseIdSchema.optional(),
  startedAt: z.date().optional(),
  status: BorrowRequestStatusSchema,
  userId: DatabaseIdSchema,
});

export type BorrowRequestDocument = z.infer<typeof BorrowRequestDocumentSchema>;

export const CreateBorrowRequestInputSchema = BorrowRequestDocumentSchema.omit({
  _id: true,
  approvedDurationDays: true,
  cancelledAt: true,
  createdAt: true,
  dueAt: true,
  rejectionReason: true,
  returnedAt: true,
  reviewedAt: true,
  reviewedByUserId: true,
  startedAt: true,
  updatedAt: true,
}).extend({
  paymentMethod: PaymentMethodSchema.default("onsite-cash"),
  paymentStatus: PaymentStatusSchema.default("unpaid"),
  requestedAt: z.date().optional(),
  status: BorrowRequestStatusSchema.default("pending"),
});
export type CreateBorrowRequestInput = z.infer<typeof CreateBorrowRequestInputSchema>;

export const UpdateBorrowRequestInputSchema = BorrowRequestDocumentSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  requestedAt: true,
  userId: true,
  bookId: true,
  bookCopyId: true,
}).partial();
export type UpdateBorrowRequestInput = z.infer<typeof UpdateBorrowRequestInputSchema>;