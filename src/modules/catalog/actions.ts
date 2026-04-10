"use server";

import { z } from "zod";

import { requireMemberSession } from "@/lib/auth/server";
import { createBorrowRequestForUser } from "@/lib/data/services/borrow-requests";
import { getBookRecordById } from "@/lib/data";

import {
  type BookBorrowRequestState,
} from "./borrow-request";

const requiredTrimmedFormString = (message: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value : undefined),
    z.string().trim().min(1, message),
  );

const optionalTrimmedFormString = () =>
  z.preprocess(
    (value) => (typeof value === "string" ? value : undefined),
    z.string().trim().optional(),
  );

const bookBorrowRequestSchema = z.object({
  bookId: requiredTrimmedFormString("Missing selected book."),
  customDurationDays: optionalTrimmedFormString(),
  durationOption: requiredTrimmedFormString("Select a duration option."),
  requestMode: z.preprocess(
    (value) => (typeof value === "string" ? value : undefined),
    z.enum(["custom", "predefined"]),
  ),
});

function normalizeBorrowRequestError(error: unknown) {
  const message = error instanceof Error ? error.message : "Could not create the borrowing request right now.";

  if (/ssl|tlsv1|mongodb|server selection/i.test(message)) {
    return "Borrow request could not be saved because the database connection is unavailable right now.";
  }

  return message;
}

export async function createBookBorrowRequestAction(
  formData: FormData,
): Promise<BookBorrowRequestState> {
  const parsed = bookBorrowRequestSchema.safeParse({
    bookId: formData.get("bookId"),
    customDurationDays: formData.get("customDurationDays"),
    durationOption: formData.get("durationOption"),
    requestMode: formData.get("requestMode"),
  });

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? "Review the borrowing request and try again.",
      status: "error",
    };
  }

  const session = await requireMemberSession(`/books/${parsed.data.bookId}`);
  const currentUser = session.currentUser;

  if (!currentUser) {
    return {
      message: "You need an active member session before creating a borrowing request.",
      status: "error",
    };
  }

  const book = getBookRecordById(parsed.data.bookId);

  if (!book) {
    return {
      message: "The selected book could not be found.",
      status: "error",
    };
  }

  const requestedDurationDays =
    parsed.data.requestMode === "custom"
      ? Number(parsed.data.customDurationDays?.trim() ?? "")
      : Number(parsed.data.durationOption);

  if (!Number.isInteger(requestedDurationDays) || requestedDurationDays <= 0) {
    return {
      message:
        parsed.data.requestMode === "custom"
          ? "Enter a valid number of days for the custom request."
          : "Select a valid predefined duration.",
      status: "error",
    };
  }

  try {
    await createBorrowRequestForUser({
      bookId: parsed.data.bookId,
      durationType: parsed.data.requestMode,
      requestedDurationDays,
      userId: currentUser.id,
    });

    return {
      message:
        parsed.data.requestMode === "custom"
          ? "Custom borrowing request submitted. The first available copy has been reserved for staff review."
          : "Borrow request created successfully. The first available copy has been reserved for this request.",
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeBorrowRequestError(error),
      status: "error",
    };
  }
}