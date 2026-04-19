"use server";

import { revalidatePath } from "next/cache";

import {
  canAssignAppUserRole,
  canCreateAppUsers,
  canManageAppUserRecord,
  getAppRoleDisplayLabel,
  getCurrentUser,
} from "@/lib/auth";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import {
  createManagedUser,
  updateManagedUserRole,
  updateManagedUserStatus,
} from "@/lib/data/services/admin-users";

import {
  getAdminUserProfileRecordByIdFromStore,
  toAdminUserRecord,
} from "./server";
import {
  adminUserFormSchema,
  updateAdminUserRoleSchema,
  updateAdminUserStatusSchema,
  type CreateAdminUserResult,
  type UpdateAdminUserRoleInput,
  type UpdateAdminUserRoleResult,
  type UpdateAdminUserStatusInput,
  type UpdateAdminUserStatusResult,
} from "./types";

function normalizeMutationError(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "The user management change could not be completed.";
}

function revalidateAdminUserRoutes(userId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/users");

  if (userId) {
    revalidatePath(`/admin/users/${userId}`);
  }
}

export async function createAdminUserAction(
  input: unknown,
): Promise<CreateAdminUserResult> {
  const session = await requireAuthorizedRoute("/admin/users");

  if (!canCreateAppUsers(session)) {
    return {
      message:
        "Only admin and super-admin operators can create accounts from this screen.",
      status: "error",
    };
  }

  const parsed = adminUserFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      message:
        parsed.error.issues[0]?.message ??
        "Review the new account details before saving.",
      status: "error",
    };
  }

  if (!canAssignAppUserRole(session, parsed.data.role)) {
    return {
      message: `You cannot create a ${getAppRoleDisplayLabel(parsed.data.role)} account from the current session.`,
      status: "error",
    };
  }

  try {
    const createdUserId = await createManagedUser({
      auth0UserId: parsed.data.auth0UserId,
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      onboardingNote: parsed.data.onboardingNote,
      role: parsed.data.role,
      status: parsed.data.accountStatus,
      temporaryPassword: parsed.data.temporaryPassword,
    });
    const record = await getAdminUserProfileRecordByIdFromStore(
      typeof createdUserId === "string" ? createdUserId : createdUserId.id,
    );

    revalidateAdminUserRoutes(record?.id);

    return {
      message:
        parsed.data.auth0UserId.trim().length > 0
          ? `Account created and linked to the provided Auth0 identity as ${getAppRoleDisplayLabel(parsed.data.role)}.`
          : `Account created locally as ${getAppRoleDisplayLabel(parsed.data.role)}.`,
      record: record ? toAdminUserRecord(record) : undefined,
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeMutationError(error),
      status: "error",
    };
  }
}

export async function updateAdminUserRoleAction(
  input: UpdateAdminUserRoleInput,
): Promise<UpdateAdminUserRoleResult> {
  const session = await requireAuthorizedRoute("/admin/users");
  const parsed = updateAdminUserRoleSchema.safeParse(input);

  if (!parsed.success) {
    return {
      message:
        parsed.error.issues[0]?.message ??
        "Review the selected role before saving.",
      status: "error",
    };
  }

  const currentOperator = getCurrentUser(session);

  if (currentOperator?.id === parsed.data.userId) {
    return {
      message:
        "Change another account instead. The currently signed-in account cannot change its own role here.",
      status: "error",
    };
  }

  const targetRecord = await getAdminUserProfileRecordByIdFromStore(
    parsed.data.userId,
  );

  if (!targetRecord) {
    return {
      message: "The selected user could not be found.",
      status: "error",
    };
  }

  if (!canManageAppUserRecord(session, targetRecord.role)) {
    return {
      message:
        "The current session cannot modify that account.",
      status: "error",
    };
  }

  if (!canAssignAppUserRole(session, parsed.data.role)) {
    return {
      message: `You cannot assign the ${getAppRoleDisplayLabel(parsed.data.role)} role from the current session.`,
      status: "error",
    };
  }

  try {
    await updateManagedUserRole(parsed.data.userId, parsed.data.role);

    revalidateAdminUserRoutes(parsed.data.userId);

    return {
      message: `Role updated to ${getAppRoleDisplayLabel(parsed.data.role)}.`,
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeMutationError(error),
      status: "error",
    };
  }
}

export async function updateAdminUserStatusAction(
  input: UpdateAdminUserStatusInput,
): Promise<UpdateAdminUserStatusResult> {
  const session = await requireAuthorizedRoute("/admin/users");
  const parsed = updateAdminUserStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      message:
        parsed.error.issues[0]?.message ??
        "Review the selected account state before saving.",
      status: "error",
    };
  }

  const currentOperator = getCurrentUser(session);

  if (currentOperator?.id === parsed.data.userId) {
    return {
      message:
        "Change another account instead. The currently signed-in account cannot change its own status here.",
      status: "error",
    };
  }

  const targetRecord = await getAdminUserProfileRecordByIdFromStore(
    parsed.data.userId,
  );

  if (!targetRecord) {
    return {
      message: "The selected user could not be found.",
      status: "error",
    };
  }

  if (!canManageAppUserRecord(session, targetRecord.role)) {
    return {
      message:
        "The current session cannot modify that account.",
      status: "error",
    };
  }

  try {
    await updateManagedUserStatus(parsed.data.userId, parsed.data.status);

    revalidateAdminUserRoutes(parsed.data.userId);

    return {
      message:
        parsed.data.status === "active"
          ? "Account reactivated."
          : "Account suspended.",
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeMutationError(error),
      status: "error",
    };
  }
}