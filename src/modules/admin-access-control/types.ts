import { z } from "zod";

import {
  AppAdminSectionAccessSchema,
  type AppAdminSectionAccess,
  type AppUserAccessConfig,
  type AppUserRole,
  type AppUserStatus,
} from "@/lib/auth/app-user-model";
import type { ResolvedAppSectionPermissions } from "@/lib/auth";

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

export const accessControlPermissionLevelValues = [
  "inherit",
  "none",
  "access",
  "manage",
] as const;

export const AccessControlPermissionLevelSchema = z.enum(
  accessControlPermissionLevelValues,
);
export type AccessControlPermissionLevel = z.infer<
  typeof AccessControlPermissionLevelSchema
>;

export const updateAdminAccessControlUserSchema = z.object({
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

export type { AppAdminSectionAccess };