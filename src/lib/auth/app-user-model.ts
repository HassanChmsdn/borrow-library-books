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

export const APP_ADMIN_SECTION_VALUES = [
  "books",
  "categories",
  "inventory",
  "borrowings",
  "users",
  "financial",
  "accessControl",
] as const;

export const AppAdminSectionSchema = z.enum(APP_ADMIN_SECTION_VALUES);
export type AppAdminSection = z.infer<typeof AppAdminSectionSchema>;

export const AppAdminSectionPermissionSchema = z
  .object({
    canAccess: z.boolean().optional(),
    canManage: z.boolean().optional(),
  })
  .partial();
export type AppAdminSectionPermission = z.infer<
  typeof AppAdminSectionPermissionSchema
>;

export const AppAdminSectionAccessSchema = z
  .object({
    accessControl: AppAdminSectionPermissionSchema.optional(),
    books: AppAdminSectionPermissionSchema.optional(),
    borrowings: AppAdminSectionPermissionSchema.optional(),
    categories: AppAdminSectionPermissionSchema.optional(),
    financial: AppAdminSectionPermissionSchema.optional(),
    inventory: AppAdminSectionPermissionSchema.optional(),
    users: AppAdminSectionPermissionSchema.optional(),
  })
  .partial();
export type AppAdminSectionAccess = z.infer<typeof AppAdminSectionAccessSchema>;

export const AppUserAccessConfigSchema = z
  .object({
    sections: AppAdminSectionAccessSchema.optional(),
    canManageUsers: z.boolean().optional(),
    canManageBooks: z.boolean().optional(),
    canManageCategories: z.boolean().optional(),
    canManageInventory: z.boolean().optional(),
    canManageBorrowings: z.boolean().optional(),
    canViewFinancials: z.boolean().optional(),
    canManageFinancials: z.boolean().optional(),
    canManageAccessControl: z.boolean().optional(),
  })
  .partial();
export type AppUserAccessConfig = z.infer<typeof AppUserAccessConfigSchema>;

export const APP_USER_STATUS_VALUES = ["active", "suspended"] as const;
export const AppUserStatusSchema = z.enum(APP_USER_STATUS_VALUES);
export type AppUserStatus = z.infer<typeof AppUserStatusSchema>;