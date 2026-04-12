"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/server";
import {
  deleteAdminBook,
  saveAdminBook,
} from "@/lib/data/services/admin-books";

import { adminBookFormSchema, type AdminBookFormMode, type AdminBookFormValues } from "./types";

interface AdminBookMutationResult {
  bookId?: string;
  message: string;
  status: "error" | "success";
}

interface SaveAdminBookActionInput {
  bookId?: string;
  mode: AdminBookFormMode;
  values: AdminBookFormValues;
}

function normalizeAdminBookMutationError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "The book could not be saved right now.";

  if (/ssl|tlsv1|mongodb|server selection/i.test(message)) {
    return "Book changes could not be saved because the database connection is unavailable right now.";
  }

  return message;
}

function revalidateAdminBookPaths(bookId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/books");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/inventory");
  revalidatePath("/books");

  if (bookId) {
    revalidatePath(`/admin/books/${bookId}`);
    revalidatePath(`/books/${bookId}`);
  }
}

export async function saveAdminBookAction(
  input: SaveAdminBookActionInput,
): Promise<AdminBookMutationResult> {
  const parsed = adminBookFormSchema.safeParse(input.values);

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? "Review the book details and try again.",
      status: "error",
    };
  }

  await requireAdminSession("/admin/books");

  try {
    const savedBook = await saveAdminBook({
      allowCustomDuration: parsed.data.durationSettings.allowCustomDuration,
      author: parsed.data.basicInfo.author,
      bookId: input.mode === "edit" ? input.bookId : undefined,
      categoryLabel: parsed.data.basicInfo.category,
      coverImageFileName: parsed.data.cover.fileName,
      description: parsed.data.basicInfo.description,
      feeCents:
        parsed.data.feeSettings.mode === "free"
          ? 0
          : Math.round(Number(parsed.data.feeSettings.amount) * 100),
      isbn: parsed.data.basicInfo.isbn,
      metadata: parsed.data.metadata,
      predefinedDurations: parsed.data.durationSettings.presetDays,
      status: parsed.data.status,
      title: parsed.data.basicInfo.title,
    });

    revalidateAdminBookPaths(savedBook.id);

    return {
      bookId: savedBook.id,
      message:
        input.mode === "create"
          ? `${savedBook.title} was added to the catalog.`
          : `${savedBook.title} was updated successfully.`,
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeAdminBookMutationError(error),
      status: "error",
    };
  }
}

export async function deleteAdminBookAction(
  bookId: string,
): Promise<AdminBookMutationResult> {
  await requireAdminSession("/admin/books");

  try {
    const deletedBook = await deleteAdminBook(bookId);
    revalidateAdminBookPaths(bookId);

    return {
      bookId: deletedBook.id,
      message: `${deletedBook.title} was removed from the catalog.`,
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeAdminBookMutationError(error),
      status: "error",
    };
  }
}