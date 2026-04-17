import type {
  AppUserAccessConfig,
  AppUserRole,
  AppUserStatus,
} from "./app-user-model";
import { findUserRecordByMockRole } from "@/lib/data/repositories/users";

export type {
  AppUserAccessConfig,
  AppUserRole,
  AppUserStatus,
} from "./app-user-model";

export interface AppUserRecord {
  id: string;
  authProvider: "mock" | "auth0";
  authSubject: string;
  access?: AppUserAccessConfig;
  email: string;
  fullName: string;
  role: AppUserRole;
  status: AppUserStatus;
  subtitle: string;
}

function toAppUserRecord(
  authProvider: AppUserRecord["authProvider"],
  authSubject: string,
  record: {
    access?: AppUserAccessConfig;
    email: string;
    fullName: string;
    id: string;
    role: AppUserRole;
    status: AppUserStatus;
    subtitle: string;
  },
): AppUserRecord {
  return {
    authProvider,
    authSubject,
    access: record.access,
    email: record.email,
    fullName: record.fullName,
    id: record.id,
    role: record.role,
    status: record.status,
    subtitle: record.subtitle,
  };
}

export function getMockAppUserRecord(role: AppUserRole) {
  const record = findUserRecordByMockRole(role);

  if (!record) {
    return null;
  }

  return toAppUserRecord("mock", role, record);
}