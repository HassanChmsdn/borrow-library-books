import type { AppUserAccessConfig, AppUserRole, AppUserStatus } from "@/lib/db";
import { getAppRoleAccountLabel, hasAdminAccessRole } from "@/lib/auth/roles";
import { adminSharedUsers } from "@/modules/admin-shared/mock-data";

type UserManagementRole = "user" | "admin";

interface CreateMockUserRecordInput {
  access?: AppUserAccessConfig;
  auth0UserId?: string;
  email: string;
  fullName: string;
  profileNote?: string;
  role: AppUserRole;
  status: AppUserStatus;
  subtitle?: string;
  visibleInAdminDirectory?: boolean;
}

export interface UserRepositoryRecord {
  access?: AppUserAccessConfig;
  auth0UserId?: string;
  email: string;
  fullName: string;
  id: string;
  joinedOn: string;
  managementRole: UserManagementRole;
  membershipLabel: string;
  mockRole?: AppUserRole;
  profileNote: string;
  role: AppUserRole;
  status: AppUserStatus;
  subtitle: string;
  visibleInAdminDirectory: boolean;
}

function toAppUserRole(role: UserManagementRole): AppUserRole {
  return role === "admin" ? "admin" : "member";
}

function toUserManagementRole(role: AppUserRole): UserManagementRole {
  return hasAdminAccessRole(role) ? "admin" : "user";
}

function createUserSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

const visibleUserRecords: ReadonlyArray<UserRepositoryRecord> =
  adminSharedUsers.map((user) => ({
    auth0UserId:
      user.id === "sara-chehab"
        ? "auth0|member-sara-chehab"
        : user.id === "lina-saad"
          ? "auth0|lina-saad"
          : undefined,
    email: user.email,
    fullName: user.fullName,
    id: user.id,
    joinedOn: user.joinedOn,
    managementRole: user.role,
    membershipLabel: user.membershipLabel,
    profileNote: user.profileNote,
    role: toAppUserRole(user.role),
    status: user.status,
    subtitle: user.membershipLabel,
    visibleInAdminDirectory: true,
    ...(user.id === "sara-chehab" ? { mockRole: "member" as const } : {}),
  }));

const hiddenAuthUsers: ReadonlyArray<UserRepositoryRecord> = [
  {
    auth0UserId: "auth0|super-admin-rana-haddad",
    email: "rana.haddad@library.test",
    fullName: "Rana Haddad",
    id: "super-admin-rana-haddad",
    joinedOn: "2024-07-01T00:00:00.000Z",
    managementRole: toUserManagementRole("super_admin"),
    membershipLabel: getAppRoleAccountLabel("super_admin"),
    mockRole: "super_admin",
    profileNote:
      "Hidden super-admin identity reserved for future manual Auth0 and MongoDB provisioning flows.",
    role: "super_admin",
    status: "active",
    subtitle: getAppRoleAccountLabel("super_admin"),
    visibleInAdminDirectory: false,
  },
  {
    auth0UserId: "auth0|admin-samir-chahine",
    email: "samir.chahine@library.test",
    fullName: "Samir Chahine",
    id: "admin-samir-chahine",
    joinedOn: "2024-08-12T00:00:00.000Z",
    managementRole: toUserManagementRole("admin"),
    membershipLabel: getAppRoleAccountLabel("admin"),
    mockRole: "admin",
    profileNote:
      "Internal admin identity used for the mocked access flow and future staff account mapping.",
    role: "admin",
    status: "active",
    subtitle: "Shift lead account",
    visibleInAdminDirectory: false,
  },
  {
    auth0UserId: "auth0|employee-mira-aziz",
    email: "mira.aziz@library.test",
    fullName: "Mira Aziz",
    id: "employee-mira-aziz",
    joinedOn: "2024-09-03T00:00:00.000Z",
    managementRole: toUserManagementRole("employee"),
    membershipLabel: getAppRoleAccountLabel("employee"),
    mockRole: "employee",
    profileNote:
      "Internal employee identity used to validate future staff authorization flows outside the primary admin role.",
    role: "employee",
    status: "active",
    subtitle: getAppRoleAccountLabel("employee"),
    visibleInAdminDirectory: false,
  },
  {
    auth0UserId: "auth0|financial-nadine-fares",
    email: "nadine.fares@library.test",
    fullName: "Nadine Fares",
    id: "financial-nadine-fares",
    joinedOn: "2024-09-18T00:00:00.000Z",
    managementRole: toUserManagementRole("financial"),
    membershipLabel: getAppRoleAccountLabel("financial"),
    mockRole: "financial",
    profileNote:
      "Internal financial identity used to validate future cash and reconciliation access paths.",
    role: "financial",
    status: "active",
    subtitle: getAppRoleAccountLabel("financial"),
    visibleInAdminDirectory: false,
  },
];

const userRecords: UserRepositoryRecord[] = [
  ...visibleUserRecords,
  ...hiddenAuthUsers,
];

const mockUserAccessOverrides = new Map<string, AppUserAccessConfig | null>();
const mockUserRoleOverrides = new Map<string, AppUserRole>();

function applyMockUserRoleOverride(record: UserRepositoryRecord) {
  if (!mockUserRoleOverrides.has(record.id)) {
    return record;
  }

  const role = mockUserRoleOverrides.get(record.id) ?? record.role;

  return {
    ...record,
    managementRole: toUserManagementRole(role),
    membershipLabel: getAppRoleAccountLabel(role),
    role,
    subtitle: getAppRoleAccountLabel(role),
  } satisfies UserRepositoryRecord;
}

function applyMockUserAccessOverride(record: UserRepositoryRecord) {
  const roleAdjustedRecord = applyMockUserRoleOverride(record);

  if (!mockUserAccessOverrides.has(record.id)) {
    return roleAdjustedRecord;
  }

  const access = mockUserAccessOverrides.get(record.id) ?? undefined;

  return {
    ...roleAdjustedRecord,
    access,
  } satisfies UserRepositoryRecord;
}

export function listUserRecords() {
  return userRecords.map((record) => applyMockUserAccessOverride(record));
}

export function listVisibleUserRecords() {
  return listUserRecords().filter((user) => user.visibleInAdminDirectory);
}

export function getUserRecordById(userId: string) {
  const record = userRecords.find((user) => user.id === userId);

  return record ? applyMockUserAccessOverride(record) : null;
}

export function findUserRecordByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const record = userRecords.find(
    (user) => user.email.trim().toLowerCase() === normalizedEmail,
  );

  return record ? applyMockUserAccessOverride(record) : null;
}

export function findUserRecordByAuth0Subject(subject: string) {
  const record = userRecords.find((user) => user.auth0UserId === subject);

  return record ? applyMockUserAccessOverride(record) : null;
}

export function findUserRecordByMockRole(role: AppUserRole) {
  const record = userRecords.find((user) => user.mockRole === role);

  return record ? applyMockUserAccessOverride(record) : null;
}

export function setMockUserAccessConfig(
  userId: string,
  access: AppUserAccessConfig | undefined,
) {
  const record = userRecords.find((user) => user.id === userId);

  if (!record) {
    return null;
  }

  if (access) {
    mockUserAccessOverrides.set(userId, access);
  } else {
    mockUserAccessOverrides.set(userId, null);
  }

  return applyMockUserAccessOverride(record);
}

export function setMockUserRole(userId: string, role: AppUserRole) {
  const record = userRecords.find((user) => user.id === userId);

  if (!record) {
    return null;
  }

  mockUserRoleOverrides.set(userId, role);

  return applyMockUserAccessOverride(record);
}

export function setMockUserStatus(userId: string, status: AppUserStatus) {
  const record = userRecords.find((user) => user.id === userId);

  if (!record) {
    return null;
  }

  record.status = status;

  return applyMockUserAccessOverride(record);
}

export function createMockUserRecord(input: CreateMockUserRecordInput) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const trimmedName = input.fullName.trim();
  const slug = createUserSlug(trimmedName || normalizedEmail) || "new-user";
  const id = `${slug}-${Date.now().toString(36)}`;
  const roleLabel = getAppRoleAccountLabel(input.role);
  const record: UserRepositoryRecord = {
    access: input.access,
    auth0UserId: input.auth0UserId,
    email: normalizedEmail,
    fullName: trimmedName,
    id,
    joinedOn: new Date().toISOString(),
    managementRole: toUserManagementRole(input.role),
    membershipLabel: roleLabel,
    profileNote:
      input.profileNote ??
      "Created through the admin user management flow and ready for future identity-provider linking.",
    role: input.role,
    status: input.status,
    subtitle: input.subtitle ?? roleLabel,
    visibleInAdminDirectory: input.visibleInAdminDirectory ?? true,
  };

  userRecords.unshift(record);

  return applyMockUserAccessOverride(record);
}
