import "server-only";

import type { AppUserRole, AppUserStatus } from "./app-user-model";
import {
  ensureAppUserForAuth0Identity,
  lookupAppUserByAuth0Identity,
} from "@/lib/data/services/app-users";

import { getMockAppUserRecord, type AppUserRecord } from "./app-users";

export type { AppUserRole, AppUserStatus } from "./app-user-model";
export type { AppUserRecord } from "./app-users";

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

export async function getAppUserRecordByIdentity(options: {
  provider: AppUserRecord["authProvider"];
  subject: string;
}) {
  if (options.provider === "mock") {
    return getMockAppUserRecord(options.subject as AppUserRole);
  }

  const record = await lookupAppUserByAuth0Identity(options.subject);

  if (!record) {
    return null;
  }

  return toAppUserRecord("auth0", options.subject, record);
}

export async function ensureAuth0AppUserRecord(options: {
  email?: string | null;
  fullName?: string | null;
  subject: string;
}) {
  const record = await ensureAppUserForAuth0Identity({
    email: options.email,
    name: options.fullName,
    subject: options.subject,
  });

  if (!record) {
    return null;
  }

  return toAppUserRecord("auth0", options.subject, record);
}
