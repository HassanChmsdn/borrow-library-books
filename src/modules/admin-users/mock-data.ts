import type { AdminFilterOption } from "@/components/admin";

import type {
  AdminUserRecord,
  AdminUsersRoleFilter,
} from "./types";

export const adminUsersRoleOptions: ReadonlyArray<
  AdminFilterOption<AdminUsersRoleFilter>
> = [
  { label: "All roles", value: "all" },
  { label: "Users", value: "user" },
  { label: "Admins", value: "admin" },
];

export const adminUserRecords: ReadonlyArray<AdminUserRecord> = [
  {
    id: "sara-chehab",
    fullName: "Sara Chehab",
    email: "sara.chehab@library.test",
    role: "user",
    status: "active",
    joinedDateLabel: "Joined 14 Jan 2026",
    borrowingSummaryLabel: "2 active, 1 pending",
    borrowingSummaryMeta: "One title due in 2 days",
    profileHref: "/admin/users/sara-chehab",
  },
  {
    id: "lina-saad",
    fullName: "Lina Saad",
    email: "lina.saad@library.test",
    role: "user",
    status: "suspended",
    joinedDateLabel: "Joined 02 Nov 2025",
    borrowingSummaryLabel: "1 overdue case",
    borrowingSummaryMeta: "Cash settlement due onsite",
    profileHref: "/admin/users/lina-saad",
  },
  {
    id: "jad-khoury",
    fullName: "Jad Khoury",
    email: "jad.khoury@library.test",
    role: "admin",
    status: "active",
    joinedDateLabel: "Joined 23 Sep 2024",
    borrowingSummaryLabel: "No personal loans",
    borrowingSummaryMeta: "Catalog manager account",
    profileHref: "/admin/users/jad-khoury",
  },
  {
    id: "maya-sayegh",
    fullName: "Maya Sayegh",
    email: "maya.sayegh@library.test",
    role: "user",
    status: "active",
    joinedDateLabel: "Joined 19 Feb 2026",
    borrowingSummaryLabel: "3 active loans",
    borrowingSummaryMeta: "One custom-duration borrowing",
    profileHref: "/admin/users/maya-sayegh",
  },
  {
    id: "omar-haddad",
    fullName: "Omar Haddad",
    email: "omar.haddad@library.test",
    role: "admin",
    status: "active",
    joinedDateLabel: "Joined 09 Jun 2024",
    borrowingSummaryLabel: "No personal loans",
    borrowingSummaryMeta: "Borrowings operations lead",
    profileHref: "/admin/users/omar-haddad",
  },
  {
    id: "rana-azar",
    fullName: "Rana Azar",
    email: "rana.azar@library.test",
    role: "user",
    status: "active",
    joinedDateLabel: "Joined 28 Mar 2026",
    borrowingSummaryLabel: "New account",
    borrowingSummaryMeta: "No borrowing activity yet",
    profileHref: "/admin/users/rana-azar",
  },
];

export function getAdminUserRecordById(userId: string) {
  return adminUserRecords.find((record) => record.id === userId);
}