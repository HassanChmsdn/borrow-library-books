import { z } from "zod";

import {
  AppAdminSectionAccessSchema,
  type AppAdminSectionAccess,
  type AppUserAccessConfig,
  type AppUserRole,
  type AppUserStatus,
} from "@/lib/auth/app-user-model";
import type { ResolvedAppSectionPermissions } from "@/lib/auth";

export type AdminAccessControlManagedRole = Exclude<AppUserRole, "member">;

export interface AdminAccessControlUserRecord {
  access?: AppUserAccessConfig;
  effectivePermissions: ResolvedAppSectionPermissions;
  email: string;
  fullName: string;
  hasSectionOverrides: boolean;
  id: string;
  role: AppUserRole;
  status: AppUserStatus;
  subtitle: string;
}

export interface AdminAccessControlRolePolicyRecord {
  effectivePermissions: ResolvedAppSectionPermissions;
  role: AdminAccessControlManagedRole;
}

export const updateAdminAccessControlUserSchema = z.object({
  role: z.enum(["super_admin", "admin", "employee", "financial", "member"]),
  sections: AppAdminSectionAccessSchema.optional(),
  userId: z.string().trim().min(1),
});

export type UpdateAdminAccessControlUserInput = z.infer<
  typeof updateAdminAccessControlUserSchema
>;

export interface UpdateAdminAccessControlUserResult {
  message: string;
  record?: AdminAccessControlUserRecord;
  status: "error" | "success";
}

export const updateAdminAccessControlRolePolicySchema = z.object({
  role: z.enum(["super_admin", "admin", "employee", "financial"]),
  sections: AppAdminSectionAccessSchema.optional(),
});

export type UpdateAdminAccessControlRolePolicyInput = z.infer<
  typeof updateAdminAccessControlRolePolicySchema
>;

export interface UpdateAdminAccessControlRolePolicyResult {
  message: string;
  record?: AdminAccessControlRolePolicyRecord;
  status: "error" | "success";
}

export type { AppAdminSectionAccess };
