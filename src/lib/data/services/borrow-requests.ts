import "server-only";

import { ObjectId } from "mongodb";

import {
  CreateBorrowRequestInputSchema,
  UpdateBookCopyInputSchema,
  UpdateBorrowRequestInputSchema,
  getBookCopiesCollection,
  getBorrowRequestsCollection,
  isMongoConfigured,
  type BorrowDurationType,
  type PaymentStatus,
} from "@/lib/db";
import {
  getStoredBookCopyRecordById,
  getStoredBookRecordById,
  listStoredBookCopyRecordsForBook,
} from "@/lib/data/server";

export interface CreatedBorrowRequestRecord {
  bookCopyId: string;
  bookId: string;
  durationType: BorrowDurationType;
  feeCents: number;
  id: string;
  paymentStatus: PaymentStatus;
  requestedAt: string;
  requestedDurationDays: number;
  status: "pending";
  userId: string;
}

interface CreateBorrowRequestForUserInput {
  bookCopyId?: string;
  bookId: string;
  durationType: BorrowDurationType;
  paymentStatus?: PaymentStatus;
  requestedDurationDays: number;
  userId: string;
}

interface UpdateBorrowRequestManagementInput {
  assignedCopyId?: string;
  rejectionReason?: string;
  reviewedByUserId?: string;
  status: "active" | "cancelled" | "overdue" | "pending" | "returned";
}

function getAllowedManagementStatuses(currentStatus: string) {
  if (currentStatus === "pending") {
    return new Set(["pending", "active", "cancelled"]);
  }

  if (currentStatus === "active") {
    return new Set(["active", "overdue", "returned"]);
  }

  if (currentStatus === "overdue") {
    return new Set(["overdue", "returned"]);
  }

  return new Set<string>();
}

function toDatabaseId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : id;
}

function omitUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  ) as Partial<T>;
}

async function deriveRemainingCopyStatus(
  copyId: string,
  excludedRequestId: string,
) {
  const borrowRequests = await getBorrowRequestsCollection();
  const relatedRequests = await borrowRequests
    .find(
      {
        _id: { $ne: toDatabaseId(excludedRequestId) },
        bookCopyId: toDatabaseId(copyId),
        status: { $in: ["pending", "active", "overdue"] },
      },
      {
        projection: {
          status: 1,
        },
      },
    )
    .toArray();

  if (
    relatedRequests.some(
      (request) => request.status === "active" || request.status === "overdue",
    )
  ) {
    return "borrowed" as const;
  }

  if (relatedRequests.some((request) => request.status === "pending")) {
    return "reserved" as const;
  }

  return "available" as const;
}

async function updateBookCopyStatus(
  copyId: string,
  status: "available" | "borrowed" | "reserved",
  updatedAt: Date,
) {
  const bookCopies = await getBookCopiesCollection();
  const copyUpdate = UpdateBookCopyInputSchema.parse({
    status,
  });

  await bookCopies.updateOne(
    { _id: toDatabaseId(copyId) },
    {
      $set: {
        ...copyUpdate,
        updatedAt,
      },
    },
  );
}

async function listReservedCopyIds(
  bookId: string,
  options?: { excludeRequestId?: string },
) {
  if (!isMongoConfigured()) {
    return new Set<string>();
  }

  const borrowRequests = await getBorrowRequestsCollection();
  const selector: {
    _id?: { $ne: ObjectId | string };
    bookId: string;
    status: { $in: ["pending", "active", "overdue"] };
  } = {
    bookId,
    status: { $in: ["pending", "active", "overdue"] },
  };

  if (options?.excludeRequestId) {
    selector._id = { $ne: toDatabaseId(options.excludeRequestId) };
  }

  const reserved = await borrowRequests
    .find(selector, {
      projection: {
        bookCopyId: 1,
      },
    })
    .toArray();

  return new Set(
    reserved
      .map((record) => String(record.bookCopyId))
      .filter((value) => value.length > 0),
  );
}

async function getBorrowRequestDocument(requestId: string) {
  const borrowRequests = await getBorrowRequestsCollection();
  const request = await borrowRequests.findOne({
    _id: toDatabaseId(requestId),
  });

  if (!request?._id) {
    throw new Error("The selected borrow request could not be found.");
  }

  return request;
}

async function resolveAssignableCopy(options: {
  bookId: string;
  currentCopyId?: string;
  requestId: string;
}) {
  const reservedCopyIds = await listReservedCopyIds(options.bookId, {
    excludeRequestId: options.requestId,
  });
  const availableCopies = (await listStoredBookCopyRecordsForBook(options.bookId))
    .filter(
      (copy) =>
        (copy.status === "available" || copy.id === options.currentCopyId) &&
        !reservedCopyIds.has(copy.id),
    )
    .sort((left, right) => left.copyCode.localeCompare(right.copyCode));

  const currentCopy = options.currentCopyId
    ? await getStoredBookCopyRecordById(options.currentCopyId)
    : null;

  if (
    currentCopy &&
    currentCopy.bookId === options.bookId &&
    (currentCopy.status === "available" ||
      currentCopy.status === "borrowed" ||
      currentCopy.status === "reserved") &&
    !reservedCopyIds.has(currentCopy.id)
  ) {
    return currentCopy;
  }

  const nextCopy = availableCopies[0] ?? null;

  if (!nextCopy) {
    throw new Error("No available physical copy could be assigned to this request.");
  }

  return nextCopy;
}

export async function createBorrowRequestForUser(
  input: CreateBorrowRequestForUserInput,
) {
  if (!isMongoConfigured()) {
    throw new Error(
      "Borrow request creation requires MongoDB to be configured.",
    );
  }

  const book = await getStoredBookRecordById(input.bookId);

  if (!book) {
    throw new Error("The selected book could not be found.");
  }

  const reservedCopyIds = await listReservedCopyIds(input.bookId);
  const availableCopies = (await listStoredBookCopyRecordsForBook(input.bookId))
    .filter(
      (copy) =>
        copy.status === "available" && !reservedCopyIds.has(copy.id),
    )
    .sort((left, right) => left.copyCode.localeCompare(right.copyCode));

  const copy = input.bookCopyId
    ? await getStoredBookCopyRecordById(input.bookCopyId)
    : availableCopies[0] ?? null;

  if (!copy || copy.bookId !== input.bookId) {
    throw new Error("No available physical copy could be assigned to this request.");
  }

  if (copy.status !== "available" || reservedCopyIds.has(copy.id)) {
    throw new Error("No available physical copy could be assigned to this request.");
  }

  if (input.durationType === "custom" && !book.allowCustomDuration) {
    throw new Error("Custom duration requests are not allowed for this title.");
  }

  if (
    input.durationType === "predefined" &&
    !book.predefinedDurations.includes(
      input.requestedDurationDays as (typeof book.predefinedDurations)[number],
    )
  ) {
    throw new Error("Choose one of the predefined duration options.");
  }

  const requestedAt = new Date();
  const parsed = CreateBorrowRequestInputSchema.parse({
    bookCopyId: copy.id,
    bookId: input.bookId,
    durationType: input.durationType,
    feeCents: book.feeCents,
    paymentMethod: "onsite-cash",
    paymentStatus: input.paymentStatus ?? "unpaid",
    requestedAt,
    requestedDurationDays: input.requestedDurationDays,
    status: "pending",
    userId: input.userId,
  });

  const borrowRequests = await getBorrowRequestsCollection();
  const result = await borrowRequests.insertOne({
    ...parsed,
    createdAt: requestedAt,
    requestedAt,
    updatedAt: requestedAt,
  });

  await updateBookCopyStatus(copy.id, "reserved", requestedAt);

  return {
    bookCopyId: copy.id,
    bookId: input.bookId,
    durationType: input.durationType,
    feeCents: book.feeCents,
    id: result.insertedId.toString(),
    paymentStatus: parsed.paymentStatus,
    requestedAt: requestedAt.toISOString(),
    requestedDurationDays: input.requestedDurationDays,
    status: "pending",
    userId: input.userId,
  } satisfies CreatedBorrowRequestRecord;
}

export async function approveBorrowRequest(
  requestId: string,
  options?: {
    approvedDurationDays?: number;
    reviewedByUserId?: string;
  },
) {
  if (!isMongoConfigured()) {
    throw new Error("Borrow request management requires MongoDB to be configured.");
  }

  const request = await getBorrowRequestDocument(requestId);

  if (request.status !== "pending") {
    throw new Error("Only pending borrow requests can be approved.");
  }

  const now = new Date();
  const currentCopyId = request.bookCopyId ? String(request.bookCopyId) : undefined;
  const approvedDurationDays =
    options?.approvedDurationDays ??
    request.approvedDurationDays ??
    request.requestedDurationDays;
  const assignedCopy = await resolveAssignableCopy({
    bookId: String(request.bookId),
    currentCopyId: request.bookCopyId ? String(request.bookCopyId) : undefined,
    requestId,
  });
  const dueAt = new Date(now.getTime() + approvedDurationDays * 24 * 60 * 60 * 1000);
  const borrowRequests = await getBorrowRequestsCollection();
  const borrowRequestUpdate = UpdateBorrowRequestInputSchema.parse({
    approvedDurationDays,
    dueAt,
    reviewedAt: now,
    reviewedByUserId: options?.reviewedByUserId,
    startedAt: now,
    status: "active",
  });
  await borrowRequests.updateOne(
    { _id: request._id },
    {
      $set: {
        ...borrowRequestUpdate,
        bookCopyId: toDatabaseId(assignedCopy.id),
        updatedAt: now,
      },
      $unset: {
        cancelledAt: "",
        rejectionReason: "",
      },
    },
  );

  await updateBookCopyStatus(assignedCopy.id, "borrowed", now);

  if (currentCopyId && currentCopyId !== assignedCopy.id) {
    const releasedCopyStatus = await deriveRemainingCopyStatus(currentCopyId, requestId);
    await updateBookCopyStatus(currentCopyId, releasedCopyStatus, now);
  }

  return {
    bookCopyId: assignedCopy.id,
    id: String(request._id),
    status: "active" as const,
  };
}

export async function rejectBorrowRequest(
  requestId: string,
  options?: {
    rejectionReason?: string;
    reviewedByUserId?: string;
  },
) {
  if (!isMongoConfigured()) {
    throw new Error("Borrow request management requires MongoDB to be configured.");
  }

  const request = await getBorrowRequestDocument(requestId);

  if (request.status !== "pending") {
    throw new Error("Only pending borrow requests can be rejected.");
  }

  const now = new Date();
  const currentCopyId = request.bookCopyId ? String(request.bookCopyId) : undefined;
  const borrowRequests = await getBorrowRequestsCollection();
  const borrowRequestUpdate = UpdateBorrowRequestInputSchema.parse({
    cancelledAt: now,
    rejectionReason:
      options?.rejectionReason?.trim() || "Rejected by an admin operator.",
    reviewedAt: now,
    reviewedByUserId: options?.reviewedByUserId,
    status: "cancelled",
  });

  await borrowRequests.updateOne(
    { _id: request._id },
    {
      $set: {
        ...borrowRequestUpdate,
        updatedAt: now,
      },
    },
  );

  if (currentCopyId) {
    const releasedCopyStatus = await deriveRemainingCopyStatus(currentCopyId, requestId);
    await updateBookCopyStatus(currentCopyId, releasedCopyStatus, now);
  }

  return {
    id: String(request._id),
    status: "cancelled" as const,
  };
}

export async function markBorrowRequestReturned(
  requestId: string,
  options?: {
    reviewedByUserId?: string;
  },
) {
  if (!isMongoConfigured()) {
    throw new Error("Borrow request management requires MongoDB to be configured.");
  }

  const request = await getBorrowRequestDocument(requestId);

  if (request.status !== "active" && request.status !== "overdue") {
    throw new Error("Only active or overdue borrow requests can be returned.");
  }

  const now = new Date();
  const currentCopyId = String(request.bookCopyId);
  const borrowRequests = await getBorrowRequestsCollection();
  const borrowRequestUpdate = UpdateBorrowRequestInputSchema.parse({
    returnedAt: now,
    reviewedAt: now,
    reviewedByUserId: options?.reviewedByUserId,
    status: "returned",
  });
  await borrowRequests.updateOne(
    { _id: request._id },
    {
      $set: {
        ...borrowRequestUpdate,
        updatedAt: now,
      },
    },
  );

  const releasedCopyStatus = await deriveRemainingCopyStatus(currentCopyId, requestId);
  await updateBookCopyStatus(currentCopyId, releasedCopyStatus, now);

  return {
    id: String(request._id),
    status: "returned" as const,
  };
}

export async function updateBorrowRequestManagement(
  requestId: string,
  input: UpdateBorrowRequestManagementInput,
) {
  if (!isMongoConfigured()) {
    throw new Error("Borrow request management requires MongoDB to be configured.");
  }

  const request = await getBorrowRequestDocument(requestId);
  const allowedStatuses = getAllowedManagementStatuses(request.status);

  if (allowedStatuses.size === 0) {
    throw new Error(
      "Only pending, active, or overdue borrow requests can be managed manually.",
    );
  }

  if (!allowedStatuses.has(input.status)) {
    throw new Error("This borrowing request cannot move to the selected status.");
  }

  const now = new Date();
  const currentCopyId = String(request.bookCopyId);
  const requiresAssignedCopy =
    input.status === "pending" ||
    input.status === "active" ||
    input.status === "overdue";
  const nextCopy = requiresAssignedCopy
    ? await resolveAssignableCopy({
        bookId: String(request.bookId),
        currentCopyId: input.assignedCopyId ?? currentCopyId,
        requestId,
      })
    : null;
  const nextCopyId = nextCopy?.id ?? currentCopyId;
  const durationDays =
    request.approvedDurationDays ?? request.requestedDurationDays;
  const startedAt =
    input.status === "pending" || input.status === "cancelled"
      ? undefined
      : request.startedAt ?? now;
  const baseDueAt = startedAt
    ? new Date(startedAt.getTime() + durationDays * 24 * 60 * 60 * 1000)
    : undefined;
  const dueAt =
    input.status === "active"
      ? request.dueAt ?? baseDueAt
      : input.status === "overdue"
        ? new Date(now.getTime() - 24 * 60 * 60 * 1000)
        : input.status === "returned"
          ? request.dueAt ?? baseDueAt
          : undefined;
  const trimmedReason = input.rejectionReason?.trim();
  const borrowRequests = await getBorrowRequestsCollection();
  const borrowRequestUpdate = UpdateBorrowRequestInputSchema.parse(
    omitUndefined({
      approvedDurationDays:
        input.status === "pending" ? request.approvedDurationDays : durationDays,
      cancelledAt: input.status === "cancelled" ? now : undefined,
      dueAt,
      rejectionReason:
        input.status === "cancelled"
          ? trimmedReason || "Updated by an admin operator."
          : undefined,
      returnedAt: input.status === "returned" ? now : undefined,
      reviewedAt: now,
      reviewedByUserId: input.reviewedByUserId,
      startedAt,
      status: input.status,
    }),
  );
  const setPayload = omitUndefined({
    ...borrowRequestUpdate,
    bookCopyId: toDatabaseId(nextCopyId),
    updatedAt: now,
  });
  const unsetPayload: Record<string, ""> = {};

  if (input.status !== "cancelled") {
    unsetPayload.cancelledAt = "";
    unsetPayload.rejectionReason = "";
  }

  if (dueAt === undefined) {
    unsetPayload.dueAt = "";
  }

  if (input.status !== "returned") {
    unsetPayload.returnedAt = "";
  }

  if (startedAt === undefined) {
    unsetPayload.startedAt = "";
  }

  await borrowRequests.updateOne(
    { _id: request._id },
    {
      $set: setPayload,
      ...(Object.keys(unsetPayload).length > 0 ? { $unset: unsetPayload } : {}),
    },
  );

  const releasedCopyStatus = await deriveRemainingCopyStatus(currentCopyId, requestId);

  const nextCopyStatus =
    input.status === "pending"
      ? "reserved"
      : input.status === "active" || input.status === "overdue"
        ? "borrowed"
        : "available";

  if (currentCopyId !== nextCopyId) {
    await updateBookCopyStatus(currentCopyId, releasedCopyStatus, now);
  }

  if (requiresAssignedCopy) {
    await updateBookCopyStatus(nextCopyId, nextCopyStatus, now);
  } else {
    await updateBookCopyStatus(currentCopyId, releasedCopyStatus, now);
  }

  return {
    bookCopyId: nextCopyId,
    id: String(request._id),
    status: input.status,
  };
}