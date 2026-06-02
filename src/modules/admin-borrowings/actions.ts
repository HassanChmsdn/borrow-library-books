"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { requireAdminSectionManagement } from "@/lib/auth/server";
import {
  approveBorrowRequest,
  markBorrowRequestReturned,
  rejectBorrowRequest,
  updateBorrowRequestPaymentStatus,
  updateBorrowRequestManagement,
} from "@/lib/data/services/borrow-requests";
import { PaymentStatusSchema } from "@/lib/db";

interface AdminBorrowingMutationResult {
  message: string;
  status: "error" | "success";
}

interface UpdateAdminBorrowingInput {
  requestId: string;
}

interface ManageAdminBorrowingInput extends UpdateAdminBorrowingInput {
  assignedCopyId?: string;
  bookId?: string;
  rejectionReason?: string;
  status: "active" | "cancelled" | "overdue" | "pending" | "returned";
}

interface UpdateAdminBorrowingPaymentInput extends UpdateAdminBorrowingInput {
  bookId?: string;
  paymentStatus: "paid" | "pending" | "unpaid" | "waived";
}

function normalizeMutationError(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "The borrowing request update could not be completed.";
}

function revalidateAdminBorrowingRoutes(bookId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/borrowings");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/financial");

  if (bookId) {
    revalidatePath(`/admin/books/${bookId}`);
    revalidatePath(`/books/${bookId}`);
  }
}

export async function approveAdminBorrowingAction(
  input: UpdateAdminBorrowingInput,
): Promise<AdminBorrowingMutationResult> {
  const session = await requireAdminSectionManagement(
    "borrowings",
    "/admin/borrowings",
  );

  try {
    await approveBorrowRequest(input.requestId, {
      reviewedByUserId: getCurrentUser(session)?.id,
    });
    revalidateAdminBorrowingRoutes();

    return {
      message: "Borrow request approved.",
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeMutationError(error),
      status: "error",
    };
  }
}

export async function rejectAdminBorrowingAction(
  input: UpdateAdminBorrowingInput,
): Promise<AdminBorrowingMutationResult> {
  const session = await requireAdminSectionManagement(
    "borrowings",
    "/admin/borrowings",
  );

  try {
    await rejectBorrowRequest(input.requestId, {
      reviewedByUserId: getCurrentUser(session)?.id,
    });
    revalidateAdminBorrowingRoutes();

    return {
      message: "Borrow request rejected.",
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeMutationError(error),
      status: "error",
    };
  }
}

export async function markAdminBorrowingReturnedAction(
  input: UpdateAdminBorrowingInput,
): Promise<AdminBorrowingMutationResult> {
  const session = await requireAdminSectionManagement(
    "borrowings",
    "/admin/borrowings",
  );

  try {
    await markBorrowRequestReturned(input.requestId, {
      reviewedByUserId: getCurrentUser(session)?.id,
    });
    revalidateAdminBorrowingRoutes();

    return {
      message: "Borrowing marked as returned.",
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeMutationError(error),
      status: "error",
    };
  }
}

export async function manageAdminBorrowingAction(
  input: ManageAdminBorrowingInput,
): Promise<AdminBorrowingMutationResult> {
  const session = await requireAdminSectionManagement(
    "borrowings",
    "/admin/borrowings",
  );

  try {
    await updateBorrowRequestManagement(input.requestId, {
      assignedCopyId: input.assignedCopyId,
      rejectionReason: input.rejectionReason,
      reviewedByUserId: getCurrentUser(session)?.id,
      status: input.status,
    });
    revalidateAdminBorrowingRoutes(input.bookId);

    return {
      message: "Borrow request updated.",
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeMutationError(error),
      status: "error",
    };
  }
}

export async function updateAdminBorrowingPaymentStatusAction(
  input: UpdateAdminBorrowingPaymentInput,
): Promise<AdminBorrowingMutationResult> {
  await requireAdminSectionManagement("financial", "/admin/financial");
  const parsedPaymentStatus = PaymentStatusSchema.safeParse(
    input.paymentStatus,
  );

  if (!parsedPaymentStatus.success) {
    return {
      message: "Select a valid payment status before saving.",
      status: "error",
    };
  }

  try {
    await updateBorrowRequestPaymentStatus(
      input.requestId,
      parsedPaymentStatus.data,
    );
    revalidateAdminBorrowingRoutes(input.bookId);

    return {
      message: "Payment status updated.",
      status: "success",
    };
  } catch (error) {
    return {
      message: normalizeMutationError(error),
      status: "error",
    };
  }
}
