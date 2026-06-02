"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSectionManagement } from "@/lib/auth/server";
import {
  deleteAdminCategory,
  saveAdminCategory,
} from "@/lib/data/services/admin-categories";

import { adminCategoryFormSchema, type AdminCategoryFormValues } from "./types";

export interface AdminCategoryMutationResult {
  categoryId?: string;
  message: string;
  status: "error" | "success";
}

interface SaveAdminCategoryActionInput {
  categoryId?: string;
  mode: "create" | "edit";
  values: AdminCategoryFormValues;
}

function normalizeCategoryMutationError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "The category could not be saved right now.";

  if (/ssl|tlsv1|mongodb|server selection/i.test(message)) {
    return "Category changes could not be saved because the database connection is unavailable right now.";
  }

  return message;
}

function revalidateAdminCategoryPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/books");
  revalidatePath("/admin/categories");
  revalidatePath("/books");
}

export async function saveAdminCategoryAction(
  input: SaveAdminCategoryActionInput,
): Promise<AdminCategoryMutationResult> {
  const parsed = adminCategoryFormSchema.safeParse(input.values);

  if (!parsed.success) {
    return {
      message:
        parsed.error.issues[0]?.message ??
        "Review the category details and try again.",
      status: "error",
    };
  }

  await requireAdminSectionManagement("categories", "/admin/categories");

  try {
    const savedCategory = await saveAdminCategory({
      categoryId: input.mode === "edit" ? input.categoryId : undefined,
      description: parsed.data.description,
      name: parsed.data.name,
    });

    revalidateAdminCategoryPaths();

    return {
      categoryId: savedCategory.id,
      message:
        input.mode === "create"
          ? `${savedCategory.name} was added to categories.`
          : `${savedCategory.name} was updated successfully.`,
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeCategoryMutationError(error),
      status: "error",
    };
  }
}

export async function deleteAdminCategoryAction(
  categoryId: string,
): Promise<AdminCategoryMutationResult> {
  await requireAdminSectionManagement("categories", "/admin/categories");

  try {
    const deletedCategory = await deleteAdminCategory(categoryId);
    revalidateAdminCategoryPaths();

    return {
      categoryId: deletedCategory.id,
      message: `${deletedCategory.name} was removed from categories.`,
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeCategoryMutationError(error),
      status: "error",
    };
  }
}
