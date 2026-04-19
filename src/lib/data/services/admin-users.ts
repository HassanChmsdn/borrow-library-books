import "server-only";

import { ObjectId } from "mongodb";

import {
  getUsersCollection,
  isMongoConfigured,
  type AppUserRole,
  type AppUserStatus,
} from "@/lib/db";

import {
  createMockUserRecord,
  findUserRecordByEmail,
  findUserRecordByAuth0Subject,
  getUserRecordById,
  setMockUserRole,
  setMockUserStatus,
} from "../repositories/users";

export interface CreateManagedUserInput {
  auth0UserId?: string;
  email: string;
  fullName: string;
  onboardingNote?: string;
  role: AppUserRole;
  status: AppUserStatus;
  temporaryPassword?: string;
}

function normalizeIdentity(value: string | undefined) {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : undefined;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeName(value: string) {
  return value.trim();
}

function buildMockProfileNote(input: CreateManagedUserInput) {
  const onboardingNote = input.onboardingNote?.trim();

  if (onboardingNote) {
    return `Onboarding note: ${onboardingNote}`;
  }

  if (input.temporaryPassword?.trim()) {
    return "Temporary password prepared for mocked onboarding.";
  }

  return "Created through the admin user management flow.";
}

export async function createManagedUser(input: CreateManagedUserInput) {
  const auth0UserId = normalizeIdentity(input.auth0UserId);
  const email = normalizeEmail(input.email);
  const fullName = normalizeName(input.fullName);

  if (!isMongoConfigured()) {
    if (findUserRecordByEmail(email)) {
      throw new Error(
        "A user with that email already exists in the mocked roster.",
      );
    }

    if (auth0UserId && findUserRecordByAuth0Subject(auth0UserId)) {
      throw new Error(
        "A user with that Auth0 subject already exists in the mocked roster.",
      );
    }

    return createMockUserRecord({
      auth0UserId,
      email,
      fullName,
      profileNote: buildMockProfileNote(input),
      role: input.role,
      status: input.status,
      subtitle: undefined,
      visibleInAdminDirectory: true,
    });
  }

  if (!auth0UserId) {
    throw new Error(
      "Persisted user creation requires an existing Auth0 subject. Create the identity first, then paste its Auth0 user id.",
    );
  }

  const users = await getUsersCollection();
  const [existingByAuth0UserId, existingByEmail] = await Promise.all([
    users.findOne({ auth0UserId }),
    users.findOne({ email }),
  ]);

  if (existingByAuth0UserId) {
    throw new Error(
      "A user with that Auth0 subject already exists. Use the existing account instead of creating a duplicate linked record.",
    );
  }

  if (existingByEmail) {
    throw new Error(
      "A user with that email already exists. This flow avoids overwriting existing auth-linked application records.",
    );
  }

  const now = new Date();
  const result = await users.insertOne({
    auth0UserId,
    createdAt: now,
    email,
    name: fullName,
    role: input.role,
    status: input.status,
    updatedAt: now,
  });

  return result.insertedId.toString();
}

export async function updateManagedUserRole(userId: string, role: AppUserRole) {
  if (!isMongoConfigured()) {
    const record = setMockUserRole(userId, role);

    if (!record) {
      throw new Error("The selected user could not be found.");
    }

    return record.id;
  }

  if (!ObjectId.isValid(userId)) {
    throw new Error("The selected user id is invalid.");
  }

  const users = await getUsersCollection();
  const objectId = new ObjectId(userId);
  const record = await users.findOne({ _id: objectId });

  if (!record) {
    throw new Error("The selected user could not be found.");
  }

  await users.updateOne(
    { _id: objectId },
    {
      $set: {
        role,
        updatedAt: new Date(),
      },
    },
  );

  return userId;
}

export async function updateManagedUserStatus(
  userId: string,
  status: AppUserStatus,
) {
  if (!isMongoConfigured()) {
    const record = setMockUserStatus(userId, status);

    if (!record) {
      throw new Error("The selected user could not be found.");
    }

    return record.id;
  }

  if (!ObjectId.isValid(userId)) {
    throw new Error("The selected user id is invalid.");
  }

  const users = await getUsersCollection();
  const objectId = new ObjectId(userId);
  const record = await users.findOne({ _id: objectId });

  if (!record) {
    throw new Error("The selected user could not be found.");
  }

  await users.updateOne(
    { _id: objectId },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
  );

  return userId;
}

export async function getManagedUserIdentity(userId: string) {
  if (!isMongoConfigured()) {
    return getUserRecordById(userId);
  }

  if (!ObjectId.isValid(userId)) {
    return null;
  }

  const users = await getUsersCollection();

  return users.findOne({ _id: new ObjectId(userId) });
}