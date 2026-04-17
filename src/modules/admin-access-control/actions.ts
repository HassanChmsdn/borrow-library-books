"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import {
  AppAdminSectionAccessSchema,
  type AppAdminSection,
  type AppAdminSectionAccess,
  type AppUserAccessConfig,
  type AppUserRole,
} from "@/lib/auth/app-user-model";
import {
  getAppRoleAccountLabel,
  getResolvedAdminSectionPermissionsForDefaults,
} from "@/lib/auth";
import {
  listRoleAdminSectionDefaults,
  updateRoleAdminSectionDefaults,
} from "@/lib/auth/access-policies";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import { hasAdminAccessRole } from "@/lib/auth/roles";
import { getUsersCollection, isMongoConfigured } from "@/lib/db";
import {
  getUserRecordById,
  setMockUserAccessConfig,
  setMockUserRole,
} from "@/lib/data/repositories/users";

import {
  toAdminAccessControlUserRecord,
  listAdminAccessControlRolePolicyRecords,
} from "./server";
import {
  updateAdminAccessControlRolePolicySchema,
  updateAdminAccessControlUserSchema,
  type UpdateAdminAccessControlRolePolicyInput,
  type UpdateAdminAccessControlRolePolicyResult,
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
  const roleDefaults = await listRoleAdminSectionDefaults();

  if (!isMongoConfigured()) {
    const record = getUserRecordById(userId);

    if (!record) {
      return null;
    }

    return toAdminAccessControlUserRecord({
      access: record.access,
      email: record.email,
      effectivePermissions: getResolvedAdminSectionPermissionsForDefaults(
        record.role,
        roleDefaults,
        record.access,
      ),
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

  if (!record) {
    return null;
  }

  return toAdminAccessControlUserRecord({
    access: record.access,
    email: record.email,
    effectivePermissions: getResolvedAdminSectionPermissionsForDefaults(
      record.role,
      roleDefaults,
      record.access,
    ),
    fullName: record.name,
    id: record._id.toString(),
    role: record.role,
    status: record.status,
    subtitle: record.access?.sections ? undefined : undefined,
  });
}

async function loadUpdatedRolePolicyRecord(role: AppUserRole) {
  const records = await listAdminAccessControlRolePolicyRecords();

  return records.find((record) => record.role === role) ?? null;
}

export async function updateAdminAccessControlUserAction(
  input: UpdateAdminAccessControlUserInput,
): Promise<UpdateAdminAccessControlUserResult> {
  await requireAuthorizedRoute("/admin/settings/access-control");

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
  const nextRole = parsed.data.role;

  try {
    if (!isMongoConfigured()) {
      const currentRecord = getUserRecordById(parsed.data.userId);

      if (!currentRecord) {
        return {
          message: "The selected staff account could not be found.",
          status: "error",
        };
      }

      const nextAccess = hasAdminAccessRole(nextRole)
        ? mergeUserAccessConfig(currentRecord.access, normalizedSections)
        : undefined;

      setMockUserRole(parsed.data.userId, nextRole);
      setMockUserAccessConfig(parsed.data.userId, nextAccess);
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

      const nextAccess = hasAdminAccessRole(nextRole)
        ? mergeUserAccessConfig(currentRecord.access, normalizedSections)
        : undefined;

      await users.updateOne(
        { _id: objectId },
        nextAccess
          ? {
              $set: {
                access: nextAccess,
                role: nextRole,
                updatedAt: new Date(),
              },
            }
          : {
              $set: {
                role: nextRole,
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

    const updatedRecord = await loadUpdatedAccessControlRecord(
      parsed.data.userId,
    );

    return {
      message: hasAdminAccessRole(nextRole)
        ? normalizedSections
          ? `Role and section access were saved for ${getAppRoleAccountLabel(nextRole)}.`
          : `Role updated to ${getAppRoleAccountLabel(nextRole)} and custom section access was cleared.`
        : `Role updated to ${getAppRoleAccountLabel(nextRole)} and admin section access was cleared.`,
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

export async function updateAdminAccessControlRolePolicyAction(
  input: UpdateAdminAccessControlRolePolicyInput,
): Promise<UpdateAdminAccessControlRolePolicyResult> {
  await requireAuthorizedRoute("/admin/settings/access-control");

  const parsed = updateAdminAccessControlRolePolicySchema.safeParse(input);

  if (!parsed.success) {
    return {
      message:
        parsed.error.issues[0]?.message ??
        "Review the selected role policy before saving.",
      status: "error",
    };
  }

  try {
    await updateRoleAdminSectionDefaults(
      parsed.data.role,
      normalizeSectionAccess(parsed.data.sections),
    );

    revalidatePath("/admin");
    revalidatePath("/admin/settings/access-control");

    const updatedRecord = await loadUpdatedRolePolicyRecord(parsed.data.role);

    return {
      message: `Default section access was updated for the ${getAppRoleAccountLabel(parsed.data.role)} role.`,
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
