import {
  APP_ADMIN_SECTION_VALUES,
  type AppAdminSection,
  type AppAdminSectionPermission,
  type AppUserAccessConfig,
  type AppUserRole,
} from "./app-user-model";

export interface ResolvedAppSectionPermission {
  canAccess: boolean;
  canManage: boolean;
}

export type ResolvedAppSectionPermissions = Record<
  AppAdminSection,
  ResolvedAppSectionPermission
>;

function createResolvedSectionPermission(
  canAccess = false,
  canManage = false,
): ResolvedAppSectionPermission {
  return {
    canAccess,
    canManage,
  };
}

export function createEmptyResolvedAdminSectionPermissions(): ResolvedAppSectionPermissions {
  return APP_ADMIN_SECTION_VALUES.reduce((permissions, section) => {
    permissions[section] = createResolvedSectionPermission();

    return permissions;
  }, {} as ResolvedAppSectionPermissions);
}

export const roleAdminSectionDefaults: Record<
  AppUserRole,
  ResolvedAppSectionPermissions
> = {
  super_admin: {
    accessControl: createResolvedSectionPermission(true, true),
    books: createResolvedSectionPermission(true, true),
    borrowings: createResolvedSectionPermission(true, true),
    categories: createResolvedSectionPermission(true, true),
    financial: createResolvedSectionPermission(true, true),
    inventory: createResolvedSectionPermission(true, true),
    users: createResolvedSectionPermission(true, true),
  },
  admin: {
    accessControl: createResolvedSectionPermission(true, true),
    books: createResolvedSectionPermission(true, true),
    borrowings: createResolvedSectionPermission(true, true),
    categories: createResolvedSectionPermission(true, true),
    financial: createResolvedSectionPermission(true, true),
    inventory: createResolvedSectionPermission(true, true),
    users: createResolvedSectionPermission(true, true),
  },
  employee: {
    accessControl: createResolvedSectionPermission(false, false),
    books: createResolvedSectionPermission(true, true),
    borrowings: createResolvedSectionPermission(true, true),
    categories: createResolvedSectionPermission(true, true),
    financial: createResolvedSectionPermission(false, false),
    inventory: createResolvedSectionPermission(true, true),
    users: createResolvedSectionPermission(false, false),
  },
  financial: {
    accessControl: createResolvedSectionPermission(false, false),
    books: createResolvedSectionPermission(false, false),
    borrowings: createResolvedSectionPermission(false, false),
    categories: createResolvedSectionPermission(false, false),
    financial: createResolvedSectionPermission(true, true),
    inventory: createResolvedSectionPermission(false, false),
    users: createResolvedSectionPermission(false, false),
  },
  member: {
    accessControl: createResolvedSectionPermission(false, false),
    books: createResolvedSectionPermission(false, false),
    borrowings: createResolvedSectionPermission(false, false),
    categories: createResolvedSectionPermission(false, false),
    financial: createResolvedSectionPermission(false, false),
    inventory: createResolvedSectionPermission(false, false),
    users: createResolvedSectionPermission(false, false),
  },
};

function resolveLegacySectionAccessOverride(
  access: AppUserAccessConfig | null | undefined,
  section: AppAdminSection,
) {
  switch (section) {
    case "books":
      return access?.canManageBooks;
    case "borrowings":
      return access?.canManageBorrowings;
    case "categories":
      return access?.canManageCategories;
    case "inventory":
      return access?.canManageInventory;
    case "users":
      return access?.canManageUsers;
    case "financial":
      return access?.canManageFinancials ?? access?.canViewFinancials;
    case "accessControl":
      return access?.canManageAccessControl;
  }
}

function resolveLegacySectionManagementOverride(
  access: AppUserAccessConfig | null | undefined,
  section: AppAdminSection,
) {
  switch (section) {
    case "books":
      return access?.canManageBooks;
    case "borrowings":
      return access?.canManageBorrowings;
    case "categories":
      return access?.canManageCategories;
    case "inventory":
      return access?.canManageInventory;
    case "users":
      return access?.canManageUsers;
    case "financial":
      return access?.canManageFinancials;
    case "accessControl":
      return access?.canManageAccessControl;
  }
}

function resolveSectionPermissionOverride(
  role: AppUserRole | null | undefined,
  access: AppUserAccessConfig | null | undefined,
  section: AppAdminSection,
): ResolvedAppSectionPermission {
  if (!role) {
    return createResolvedSectionPermission();
  }

  const roleDefaults = roleAdminSectionDefaults[role][section];
  const sectionOverride = access?.sections?.[section] as
    | AppAdminSectionPermission
    | undefined;
  const accessOverride =
    sectionOverride?.canAccess ??
    resolveLegacySectionAccessOverride(access, section);
  const manageOverride =
    sectionOverride?.canManage ??
    resolveLegacySectionManagementOverride(access, section);
  const canManage = manageOverride ?? roleDefaults.canManage;
  const canAccess = (accessOverride ?? roleDefaults.canAccess) || canManage;

  return {
    canAccess,
    canManage,
  };
}

export function getResolvedAdminSectionPermissions(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
): ResolvedAppSectionPermissions {
  return APP_ADMIN_SECTION_VALUES.reduce((permissions, section) => {
    permissions[section] = resolveSectionPermissionOverride(role, access, section);

    return permissions;
  }, createEmptyResolvedAdminSectionPermissions());
}

export function canAccessAdminSectionRole(
  role: AppUserRole | null | undefined,
  access: AppUserAccessConfig | null | undefined,
  section: AppAdminSection,
) {
  return resolveSectionPermissionOverride(role, access, section).canAccess;
}

export function canManageAdminSectionRole(
  role: AppUserRole | null | undefined,
  access: AppUserAccessConfig | null | undefined,
  section: AppAdminSection,
) {
  return resolveSectionPermissionOverride(role, access, section).canManage;
}

export function canManageBooksRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return canManageAdminSectionRole(role, access, "books");
}

export function canManageBorrowingsRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return canManageAdminSectionRole(role, access, "borrowings");
}

export function canManageCategoriesRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return canManageAdminSectionRole(role, access, "categories");
}

export function canManageInventoryRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return canManageAdminSectionRole(role, access, "inventory");
}

export function canManageUsersRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return canManageAdminSectionRole(role, access, "users");
}

export function canViewFinancialsRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return canAccessAdminSectionRole(role, access, "financial");
}

export function canManageAccessControlRole(
  role: AppUserRole | null | undefined,
  access?: AppUserAccessConfig | null,
) {
  return canManageAdminSectionRole(role, access, "accessControl");
}

export function getAdminSectionLabel(section: AppAdminSection) {
  switch (section) {
    case "books":
      return "Books";
    case "categories":
      return "Categories";
    case "inventory":
      return "Inventory";
    case "borrowings":
      return "Borrowings";
    case "users":
      return "Users";
    case "financial":
      return "Financial";
    case "accessControl":
      return "Access control";
  }
}

export function getAdminSectionRoute(section: AppAdminSection) {
  switch (section) {
    case "books":
      return "/admin/books";
    case "categories":
      return "/admin/categories";
    case "inventory":
      return "/admin/inventory";
    case "borrowings":
      return "/admin/borrowings";
    case "users":
      return "/admin/users";
    case "financial":
      return "/admin/financial";
    case "accessControl":
      return "/admin/settings/access-control";
  }
}

export function getAdminSectionFromPathname(pathname: string) {
  if (pathname.startsWith("/admin/settings/access-control")) {
    return "accessControl" as const;
  }

  if (pathname.startsWith("/admin/financial")) {
    return "financial" as const;
  }

  if (pathname.startsWith("/admin/books")) {
    return "books" as const;
  }

  if (pathname.startsWith("/admin/borrowings")) {
    return "borrowings" as const;
  }

  if (pathname.startsWith("/admin/categories")) {
    return "categories" as const;
  }

  if (pathname.startsWith("/admin/inventory")) {
    return "inventory" as const;
  }

  if (pathname.startsWith("/admin/users")) {
    return "users" as const;
  }

  return null;
}