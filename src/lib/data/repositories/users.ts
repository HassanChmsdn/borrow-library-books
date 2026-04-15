import type { AppUserRole, AppUserStatus } from "@/lib/db";
import {
  getAppRoleAccountLabel,
  hasAdminAccessRole,
} from "@/lib/auth/roles";
import { adminSharedUsers } from "@/modules/admin-shared/mock-data";

type UserManagementRole = "user" | "admin";

export interface UserRepositoryRecord {
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

const visibleUserRecords: ReadonlyArray<UserRepositoryRecord> = adminSharedUsers.map(
  (user) => ({
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
  }),
);

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

const userRecords = [...visibleUserRecords, ...hiddenAuthUsers] as const;

export function listUserRecords() {
  return userRecords;
}

export function listVisibleUserRecords() {
  return userRecords.filter((user) => user.visibleInAdminDirectory);
}

export function getUserRecordById(userId: string) {
  return userRecords.find((user) => user.id === userId) ?? null;
}

export function findUserRecordByAuth0Subject(subject: string) {
  return userRecords.find((user) => user.auth0UserId === subject) ?? null;
}

export function findUserRecordByMockRole(role: AppUserRole) {
  return userRecords.find((user) => user.mockRole === role) ?? null;
}