import {
  type AppUserAccessConfig,
  APP_USER_ROLE_VALUES,
  MEMBER_APP_USER_ROLE,
  STAFF_APP_USER_ROLE_VALUES,
  type AppUserRole,
  type StaffAppUserRole,
} from "./app-user-model";

const appUserRoleSet = new Set<AppUserRole>(APP_USER_ROLE_VALUES);
const staffRoleSet = new Set<AppUserRole>(STAFF_APP_USER_ROLE_VALUES);

const roleCapabilityDefaults: Record<
  AppUserRole,
  Required<AppUserAccessConfig>
> = {
  super_admin: {
    canManageUsers: true,
    canManageBooks: true,
    canManageCategories: true,
    canManageInventory: true,
    canManageBorrowings: true,
    canViewFinancials: true,
  },
  admin: {
    canManageUsers: true,
    canManageBooks: true,
    canManageCategories: true,
    canManageInventory: true,
    canManageBorrowings: true,
    canViewFinancials: true,
  },
  employee: {
    canManageUsers: false,
    canManageBooks: true,
    canManageCategories: true,
    canManageInventory: true,
    canManageBorrowings: true,
    canViewFinancials: false,
  },
  financial: {
    canManageUsers: false,
    canManageBooks: false,
    canManageCategories: false,
    canManageInventory: false,
    canManageBorrowings: false,
    canViewFinancials: true,
  },
  member: {
    canManageUsers: false,
    canManageBooks: false,
    canManageCategories: false,
    canManageInventory: false,
    canManageBorrowings: false,
    canViewFinancials: false,
  },
};

export type AdminAccessRole = StaffAppUserRole;

export function isAppUserRole(value: unknown): value is AppUserRole {
  return typeof value === "string" && appUserRoleSet.has(value as AppUserRole);
}

export function isMemberRole(
  role: AppUserRole | null | undefined,
): role is typeof MEMBER_APP_USER_ROLE {
  return role === MEMBER_APP_USER_ROLE;
}

export function isSuperAdminRole(
  role: AppUserRole | null | undefined,
): role is "super_admin" {
  return role === "super_admin";
}

export function isAdminRole(
  role: AppUserRole | null | undefined,
): role is "admin" {
  return role === "admin";
}

export function isEmployeeRole(
  role: AppUserRole | null | undefined,
): role is "employee" {
  return role === "employee";
}

export function isFinancialRole(
  role: AppUserRole | null | undefined,
): role is "financial" {
  return role === "financial";
}

export function isStaffRole(
  role: AppUserRole | null | undefined,
): role is StaffAppUserRole {
  return role != null && staffRoleSet.has(role);
}

export function hasAdminAccessRole(role: AppUserRole | null | undefined) {
  return isStaffRole(role);
}

function resolveCapability(
  role: AppUserRole | null | undefined,
  access: AppUserAccessConfig | null | undefined,
  capability: keyof AppUserAccessConfig,
) {
  if (!role) {
    return false;
  }

  const overrideValue = access?.[capability];

  if (overrideValue !== undefined) {
    return overrideValue;
  }

  return roleCapabilityDefaults[role][capability] ?? false;
}

export function canManageUsersRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return resolveCapability(role, access, "canManageUsers");
}

export function canManageBooksRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return resolveCapability(role, access, "canManageBooks");
}

export function canManageCategoriesRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return resolveCapability(role, access, "canManageCategories");
}

export function canManageInventoryRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return resolveCapability(role, access, "canManageInventory");
}

export function canManageBorrowingsRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return resolveCapability(role, access, "canManageBorrowings");
}

export function canViewFinancialsRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return resolveCapability(role, access, "canViewFinancials");
}

export function getDefaultRedirectForAppRole(role: AppUserRole) {
  return hasAdminAccessRole(role) ? "/admin" : "/account/borrowings";
}

export function getAppRoleDisplayLabel(role: AppUserRole) {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "employee":
      return "Employee";
    case "financial":
      return "Financial";
    case "member":
      return "Member";
  }
}

export function getAppRoleAccountLabel(role: AppUserRole) {
  if (isMemberRole(role)) {
    return "Library member";
  }

  return `${getAppRoleDisplayLabel(role)} account`;
}