export type AdminUserRole = "user" | "admin";

export type AdminUserStatus = "active" | "suspended";

export type AdminUsersRoleFilter = "all" | AdminUserRole;

export interface AdminUserRecord {
  borrowingSummaryLabel: string;
  borrowingSummaryMeta: string;
  email: string;
  fullName: string;
  id: string;
  joinedDateLabel: string;
  profileHref: string;
  role: AdminUserRole;
  status: AdminUserStatus;
}

export interface AdminUsersModuleProps {
  isLoading?: boolean;
  records?: ReadonlyArray<AdminUserRecord>;
}
