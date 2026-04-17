import "server-only";

import { ObjectId } from "mongodb";

import {
  APP_ADMIN_SECTION_VALUES,
  AppAdminSectionAccessSchema,
  type AppAdminSectionAccess,
  type AppUserRole,
} from "./app-user-model";
import { getAccessPoliciesCollection, isMongoConfigured } from "@/lib/db";

import {
  createEmptyResolvedAdminSectionPermissions,
  roleAdminSectionDefaults,
  type ResolvedAppSectionPermission,
  type ResolvedAppSectionPermissions,
} from "./permissions";

const mockRolePolicyOverrides = new Map<
  AppUserRole,
  AppAdminSectionAccess | null
>();

function createResolvedPermission(
  canAccess = false,
  canManage = false,
): ResolvedAppSectionPermission {
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
      .map(([section, permission]) => {
        if (!permission) {
          return [section, undefined];
        }

        const canManage = permission.canManage === true;
        const canAccess = canManage || permission.canAccess === true;

        if (
          permission.canAccess === undefined &&
          permission.canManage === undefined
        ) {
          return [section, undefined];
        }

        return [section, { canAccess, canManage }];
      })
      .filter((entry) => entry[1] !== undefined),
  ) as AppAdminSectionAccess;

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

function mergeRoleDefaults(
  fallback: ResolvedAppSectionPermissions,
  sections: AppAdminSectionAccess | undefined,
) {
  return APP_ADMIN_SECTION_VALUES.reduce((permissions, section) => {
    const override = sections?.[section];
    const canManage = override?.canManage ?? fallback[section].canManage;
    const canAccess =
      (override?.canAccess ?? fallback[section].canAccess) || canManage;

    permissions[section] = createResolvedPermission(canAccess, canManage);

    return permissions;
  }, createEmptyResolvedAdminSectionPermissions());
}

export async function listRoleAdminSectionDefaults(): Promise<
  Record<AppUserRole, ResolvedAppSectionPermissions>
> {
  const defaults = Object.fromEntries(
    Object.entries(roleAdminSectionDefaults).map(([role, permissions]) => [
      role,
      { ...permissions },
    ]),
  ) as Record<AppUserRole, ResolvedAppSectionPermissions>;

  if (!isMongoConfigured()) {
    for (const [role, sections] of mockRolePolicyOverrides.entries()) {
      defaults[role] = mergeRoleDefaults(defaults[role], sections ?? undefined);
    }

    return defaults;
  }

  const collection = await getAccessPoliciesCollection();
  const policies = await collection.find({}).toArray();

  for (const policy of policies) {
    defaults[policy.role] = mergeRoleDefaults(
      defaults[policy.role],
      normalizeSectionAccess(policy.sections),
    );
  }

  return defaults;
}

export async function updateRoleAdminSectionDefaults(
  role: AppUserRole,
  sections: AppAdminSectionAccess | undefined,
) {
  const normalizedSections = normalizeSectionAccess(sections);

  if (!isMongoConfigured()) {
    mockRolePolicyOverrides.set(role, normalizedSections ?? null);

    return;
  }

  const collection = await getAccessPoliciesCollection();
  const now = new Date();

  if (!normalizedSections) {
    await collection.deleteOne({ role });
    return;
  }

  await collection.updateOne(
    { role },
    {
      $set: {
        role,
        sections: normalizedSections,
        updatedAt: now,
      },
      $setOnInsert: {
        _id: new ObjectId(),
        createdAt: now,
      },
    },
    { upsert: true },
  );
}
