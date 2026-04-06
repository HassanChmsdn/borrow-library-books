import type { AppUserRole, AppUserStatus } from "@/lib/db";
import {
  lookupAppUserByAuth0Identity,
  lookupAppUserByMockRole,
} from "@/lib/data";

export type { AppUserRole, AppUserStatus } from "@/lib/db";

export interface AppUserRecord {
  id: string;
  authProvider: "mock" | "auth0";
  authSubject: string;
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
    email: record.email,
    fullName: record.fullName,
    id: record.id,
    role: record.role,
    status: record.status,
    subtitle: record.subtitle,
  };
}

export function getMockAppUserRecord(role: AppUserRole) {
  const record = lookupAppUserByMockRole(role);

  if (!record) {
    return null;
  }

  return toAppUserRecord("mock", role, record);
}

export function getAppUserRecordByIdentity(options: {
  provider: AppUserRecord["authProvider"];
  subject: string;
}) {
  if (options.provider === "mock") {
    return getMockAppUserRecord(options.subject as AppUserRole);
  }

  const record = lookupAppUserByAuth0Identity(options.subject);

  if (!record) {
    return null;
  }

  return toAppUserRecord("auth0", options.subject, record);
}