"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSectionManagement } from "@/lib/auth/server";
import { saveAdminInventoryCopy } from "@/lib/data/services/admin-inventory";

import {
  adminInventoryFormSchema,
  type AdminInventoryFormMode,
  type AdminInventoryFormValues,
} from "./types";

export interface AdminInventoryMutationResult {
  copyId?: string;
  message: string;
  status: "error" | "success";
}

interface SaveAdminInventoryCopyActionInput {
  copyId?: string;
  mode: AdminInventoryFormMode;
  values: AdminInventoryFormValues;
}

function normalizeInventoryMutationError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "The inventory copy could not be saved right now.";

  if (/ssl|tlsv1|mongodb|server selection/i.test(message)) {
    return "Inventory changes could not be saved because the database connection is unavailable right now.";
  }

  return message;
}

function revalidateAdminInventoryPaths(bookId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/books");
  revalidatePath("/admin/inventory");
  revalidatePath("/books");

  if (bookId) {
    revalidatePath(`/admin/books/${bookId}`);
    revalidatePath(`/books/${bookId}`);
  }
}

export async function saveAdminInventoryCopyAction(
  input: SaveAdminInventoryCopyActionInput,
): Promise<AdminInventoryMutationResult> {
  const parsed = adminInventoryFormSchema.safeParse(input.values);

  if (!parsed.success) {
    return {
      message:
        parsed.error.issues[0]?.message ??
        "Review the inventory copy details and try again.",
      status: "error",
    };
  }

  await requireAdminSectionManagement("inventory", "/admin/inventory");

  try {
    const savedCopy = await saveAdminInventoryCopy({
      bookId: parsed.data.bookId,
      condition: parsed.data.condition,
      copyCode: parsed.data.copyCode,
      copyId: input.mode === "edit" ? input.copyId : undefined,
      status: parsed.data.status,
    });

    revalidateAdminInventoryPaths(parsed.data.bookId);

    return {
      copyId: savedCopy.id,
      message:
        input.mode === "create"
          ? `${savedCopy.copyCode} was added to inventory.`
          : `${savedCopy.copyCode} was updated successfully.`,
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeInventoryMutationError(error),
      status: "error",
    };
  }
}
