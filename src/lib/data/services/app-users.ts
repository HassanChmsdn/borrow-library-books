import "server-only";

import type { WithId } from "mongodb";

import type {
  AppUserAccessConfig,
  AppUserRole,
  AppUserStatus,
  UserDocument,
} from "@/lib/db";
import { getUsersCollection, isMongoConfigured } from "@/lib/db";
import { getAppRoleAccountLabel } from "@/lib/auth/roles";

import {
  findUserRecordByAuth0Subject,
  findUserRecordByMockRole,
} from "../repositories/users";

export interface AppUserLookupRecord {
  access?: AppUserAccessConfig;
  auth0UserId?: string;
  email: string;
  fullName: string;
  id: string;
  role: AppUserRole;
  status: AppUserStatus;
  subtitle: string;
}

function createDefaultSubtitle(role: AppUserRole) {
  return getAppRoleAccountLabel(role);
}

function createFallbackEmail(subject: string) {
  return `${subject.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}@auth.local`;
}

function createFallbackName(options: {
  email: string;
  name?: string | null;
  subject: string;
}) {
  if (options.name?.trim()) {
    return options.name.trim();
  }

  const localPart = options.email.split("@")[0]?.replace(/[._-]+/g, " ").trim();

  if (localPart) {
    return localPart.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  return `Member ${options.subject.slice(-6)}`;
}

function mapRepositoryRecord(record: {
  access?: AppUserAccessConfig;
  auth0UserId?: string;
  email: string;
  fullName: string;
  id: string;
  role: AppUserRole;
  status: AppUserStatus;
  subtitle: string;
}): AppUserLookupRecord {
  return {
    access: record.access,
    auth0UserId: record.auth0UserId,
    email: record.email,
    fullName: record.fullName,
    id: record.id,
    role: record.role,
    status: record.status,
    subtitle: record.subtitle,
  };
}

function mapUserDocument(record: WithId<UserDocument>): AppUserLookupRecord {
  return {
    access: record.access,
    auth0UserId: record.auth0UserId,
    email: record.email,
    fullName: record.name,
    id: record._id.toString(),
    role: record.role,
    status: record.status,
    subtitle: createDefaultSubtitle(record.role),
  };
}

export async function lookupAppUserByAuth0Identity(subject: string) {
  if (!isMongoConfigured()) {
    const mockRecord = findUserRecordByAuth0Subject(subject);

    return mockRecord ? mapRepositoryRecord(mockRecord) : null;
  }

  const users = await getUsersCollection();
  const user = await users.findOne({ auth0UserId: subject });

  return user ? mapUserDocument(user) : null;
}

export async function ensureAppUserForAuth0Identity(options: {
  email?: string | null;
  name?: string | null;
  subject: string;
}) {
  if (!isMongoConfigured()) {
    const mockRecord = findUserRecordByAuth0Subject(options.subject);

    if (mockRecord) {
      return mapRepositoryRecord(mockRecord);
    }

    const fallbackEmail = options.email?.trim().toLowerCase() || createFallbackEmail(options.subject);

    return {
      auth0UserId: options.subject,
      email: fallbackEmail,
      fullName: createFallbackName({
        email: fallbackEmail,
        name: options.name,
        subject: options.subject,
      }),
      id: `auth0:${options.subject}`,
      role: "member",
      status: "active",
      subtitle: createDefaultSubtitle("member"),
    } satisfies AppUserLookupRecord;
  }

  const users = await getUsersCollection();
  const existingUser = await users.findOne({ auth0UserId: options.subject });
  const now = new Date();
  const email = options.email?.trim().toLowerCase() || createFallbackEmail(options.subject);
  const name =
    existingUser?.name?.trim() ||
    createFallbackName({
      email,
      name: options.name,
      subject: options.subject,
    });

  const result = await users.findOneAndUpdate(
    { auth0UserId: options.subject },
    {
      $set: {
        auth0UserId: options.subject,
        email,
        lastLoginAt: now,
        name,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
        role: "member" as const,
        status: "active" as const,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
    },
  );

  if (!result) {
    return null;
  }

  return mapUserDocument(result);
}

export function lookupAppUserByMockRole(role: AppUserRole) {
  const record = findUserRecordByMockRole(role);

  return record ? mapRepositoryRecord(record) : null;
}