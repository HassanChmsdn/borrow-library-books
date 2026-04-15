import { z } from "zod";

export const MEMBER_APP_USER_ROLE = "member" as const;

export const STAFF_APP_USER_ROLE_VALUES = [
  "super_admin",
  "admin",
  "employee",
  "financial",
] as const;

export const APP_USER_ROLE_VALUES = [
  "super_admin",
  "admin",
  "employee",
  "financial",
  MEMBER_APP_USER_ROLE,
] as const;

export const AppUserRoleSchema = z.enum(APP_USER_ROLE_VALUES);
export type AppUserRole = z.infer<typeof AppUserRoleSchema>;
export type StaffAppUserRole = (typeof STAFF_APP_USER_ROLE_VALUES)[number];

export const APP_USER_STATUS_VALUES = ["active", "suspended"] as const;
export const AppUserStatusSchema = z.enum(APP_USER_STATUS_VALUES);
export type AppUserStatus = z.infer<typeof AppUserStatusSchema>;