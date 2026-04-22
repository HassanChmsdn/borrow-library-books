import { z } from "zod";

import {
  APP_USER_ROLE_VALUES,
  type AppUserRole,
} from "@/lib/auth/app-user-model";

export type AdminUserRole = AppUserRole;

export type AdminUserStatus = "active" | "suspended";

export type AdminUsersRoleFilter = "all" | AdminUserRole;

export type AdminUserBorrowingStatus =
  | "active"
  | "cancelled"
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
  profileHref?: string;
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

export const adminUserFormRoleValues = APP_USER_ROLE_VALUES;
export const adminUserFormStatusValues = ["active", "suspended"] as const;

export const adminUserFormSchema = z.object({
  accountStatus: z.enum(adminUserFormStatusValues),
  auth0UserId: z
    .string()
    .trim()
    .max(160, "Auth0 user id must stay within 160 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(80, "Full name must stay within 80 characters."),
  onboardingNote: z
    .string()
    .trim()
    .max(180, "Onboarding note must stay within 180 characters."),
  role: z.enum(adminUserFormRoleValues),
  temporaryPassword: z
    .string()
    .trim()
    .max(64, "Temporary password must stay within 64 characters."),
});

export type AdminUserFormValues = z.infer<typeof adminUserFormSchema>;
export type AdminUserFormFieldErrors = Partial<
  Record<keyof AdminUserFormValues, string>
>;

export const updateAdminUserRoleSchema = z.object({
  role: z.enum(APP_USER_ROLE_VALUES),
  userId: z.string().trim().min(1),
});

export type UpdateAdminUserRoleInput = z.infer<typeof updateAdminUserRoleSchema>;

export const updateAdminUserStatusSchema = z.object({
  status: z.enum(adminUserFormStatusValues),
  userId: z.string().trim().min(1),
});

export type UpdateAdminUserStatusInput = z.infer<
  typeof updateAdminUserStatusSchema
>;

export interface CreateAdminUserResult {
  message: string;
  record?: AdminUserRecord;
  status: "error" | "success";
}

export interface UpdateAdminUserRoleResult {
  message: string;
  record?: AdminUserProfileRecord;
  status: "error" | "success";
}

export interface UpdateAdminUserStatusResult {
  message: string;
  record?: AdminUserProfileRecord;
  status: "error" | "success";
}
