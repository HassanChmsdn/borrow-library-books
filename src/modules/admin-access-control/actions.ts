"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import {
  AppAdminSectionAccessSchema,
  type AppAdminSection,
  type AppAdminSectionAccess,
  type AppUserAccessConfig,
} from "@/lib/auth/app-user-model";
import { getUsersCollection, isMongoConfigured } from "@/lib/db";
import { getUserRecordById, setMockUserAccessConfig } from "@/lib/data/repositories/users";
import { requireAdminSectionManagement } from "@/lib/auth/server";
import { hasAdminAccessRole } from "@/lib/auth/roles";

import {
  toAdminAccessControlUserRecord,
} from "./server";
import {
  updateAdminAccessControlUserSchema,
  type UpdateAdminAccessControlUserInput,
  type UpdateAdminAccessControlUserResult,
} from "./types";

function normalizeSectionAccessValue(
  section: AppAdminSectionAccess[AppAdminSection],
) {
  if (!section) {
    return undefined;
  }

  const canManage = section.canManage === true;
  const canAccess = canManage || section.canAccess === true;

  if (section.canAccess === undefined && section.canManage === undefined) {
    return undefined;
  }

  return {
    canAccess,
    canManage,
  };
}

function normalizeSectionAccess(
  sections: AppAdminSectionAccess | undefined,
): AppAdminSectionAccess | undefined {
  const parsed = AppAdminSectionAccessSchema.safeParse(sections);

  if (!parsed.success || !parsed.data) {
    return undefined;
  }

  const normalized = Object.fromEntries(
    Object.entries(parsed.data)
      .map(([section, permission]) => [
        section,
        normalizeSectionAccessValue(permission),
      ])
      .filter((entry) => entry[1] !== undefined),
  ) as AppAdminSectionAccess;

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

function mergeUserAccessConfig(
  currentAccess: AppUserAccessConfig | undefined,
  sections: AppAdminSectionAccess | undefined,
) {
  const nextAccess: AppUserAccessConfig = {
    ...(currentAccess ?? {}),
  };

  if (sections) {
    nextAccess.sections = sections;
  } else {
    delete nextAccess.sections;
  }

  return Object.keys(nextAccess).length > 0 ? nextAccess : undefined;
}

function normalizeMutationError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "The access-control update could not be saved.";

  if (/ssl|tlsv1|mongodb|server selection/i.test(message)) {
    return "The access-control update could not be saved because the database connection is unavailable right now.";
  }

  return message;
}

async function loadUpdatedAccessControlRecord(userId: string) {
  if (!isMongoConfigured()) {
    const record = getUserRecordById(userId);

    if (!record || !hasAdminAccessRole(record.role)) {
      return null;
    }

    return toAdminAccessControlUserRecord({
      access: record.access,
      email: record.email,
      fullName: record.fullName,
      id: record.id,
      role: record.role,
      status: record.status,
      subtitle: record.subtitle,
    });
  }

  if (!ObjectId.isValid(userId)) {
    return null;
  }

  const users = await getUsersCollection();
  const record = await users.findOne({ _id: new ObjectId(userId) });

  if (!record || !hasAdminAccessRole(record.role)) {
    return null;
  }

  return toAdminAccessControlUserRecord({
    access: record.access,
    email: record.email,
    fullName: record.name,
    id: record._id.toString(),
    role: record.role,
    status: record.status,
    subtitle: record.access?.sections ? undefined : undefined,
  });
}

export async function updateAdminAccessControlUserAction(
  input: UpdateAdminAccessControlUserInput,
): Promise<UpdateAdminAccessControlUserResult> {
  await requireAdminSectionManagement(
    "accessControl",
    "/admin/settings/access-control",
  );

  const parsed = updateAdminAccessControlUserSchema.safeParse(input);

  if (!parsed.success) {
    return {
      message:
        parsed.error.issues[0]?.message ??
        "Review the selected account and permission values before saving.",
      status: "error",
    };
  }

  const normalizedSections = normalizeSectionAccess(parsed.data.sections);

  try {
    if (!isMongoConfigured()) {
      const currentRecord = getUserRecordById(parsed.data.userId);

      if (!currentRecord) {
        return {
          message: "The selected staff account could not be found.",
          status: "error",
        };
      }

      if (!hasAdminAccessRole(currentRecord.role)) {
        return {
          message:
            "Section overrides can only be assigned to staff accounts within the admin workspace.",
          status: "error",
        };
      }

      setMockUserAccessConfig(
        parsed.data.userId,
        mergeUserAccessConfig(currentRecord.access, normalizedSections),
      );
    } else {
      if (!ObjectId.isValid(parsed.data.userId)) {
        return {
          message: "The selected staff account could not be resolved.",
          status: "error",
        };
      }

      const users = await getUsersCollection();
      const objectId = new ObjectId(parsed.data.userId);
      const currentRecord = await users.findOne({ _id: objectId });

      if (!currentRecord) {
        return {
          message: "The selected staff account could not be found.",
          status: "error",
        };
      }

      if (!hasAdminAccessRole(currentRecord.role)) {
        return {
          message:
            "Section overrides can only be assigned to staff accounts within the admin workspace.",
          status: "error",
        };
      }

      const nextAccess = mergeUserAccessConfig(
        currentRecord.access,
        normalizedSections,
      );

      await users.updateOne(
        { _id: objectId },
        nextAccess
          ? {
              $set: {
                access: nextAccess,
                updatedAt: new Date(),
              },
            }
          : {
              $set: {
                updatedAt: new Date(),
              },
              $unset: {
                access: "",
              },
            },
      );
    }

    revalidatePath("/admin");
    revalidatePath("/admin/settings/access-control");

    const updatedRecord = await loadUpdatedAccessControlRecord(parsed.data.userId);

    return {
      message: normalizedSections
        ? "Section overrides were saved for this staff account."
        : "Section overrides were cleared and the account now follows its role defaults again.",
      record: updatedRecord ?? undefined,
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeMutationError(error),
      status: "error",
    };
  }
}