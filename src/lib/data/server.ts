import "server-only";

import { cache } from "react";

import {
  getBookCopiesCollection,
  getBooksCollection,
  getBorrowRequestsCollection,
  getCategoriesCollection,
  getUsersCollection,
  isMongoConfigured,
  type BorrowRequestDocument,
} from "@/lib/db";
import {
  getAppRoleAccountLabel,
  getAppRoleDisplayLabel,
  hasAdminAccessRole,
} from "@/lib/auth/roles";
import type {
  AdminSharedDurationPreset,
  AdminSharedMarkerTone,
} from "@/modules/admin-shared/types";

import {
  getBookCopyRecordById,
  listBookCopyRecords,
  listBookCopyRecordsForBook,
  type BookCopyRepositoryRecord,
} from "./repositories/book-copies";
import {
  countBookRecordsByCategory,
  getBookInventorySnapshot,
  getBookRecordById,
  listBookRecords,
  listBookRecordsByCategory,
  type BookInventorySnapshot,
  type BookRepositoryRecord,
} from "./repositories/books";
import {
  getBorrowRequestRecordById,
  listBorrowRequestRecords,
  listBorrowRequestRecordsForUser,
  type BorrowRequestRepositoryRecord,
} from "./repositories/borrow-requests";
import {
  getCategoryRecordById,
  listCategoryRecords,
  type CategoryRepositoryRecord,
} from "./repositories/categories";
import {
  getUserRecordById,
  listUserRecords,
  listVisibleUserRecords,
  type UserRepositoryRecord,
} from "./repositories/users";

interface LibrarySnapshot {
  bookCopies: ReadonlyArray<BookCopyRepositoryRecord>;
  books: ReadonlyArray<BookRepositoryRecord>;
  borrowRequests: ReadonlyArray<BorrowRequestRepositoryRecord>;
  categories: ReadonlyArray<CategoryRepositoryRecord>;
  users: ReadonlyArray<UserRepositoryRecord>;
}

const supportedBorrowStatuses = new Set(["pending", "active", "overdue", "returned"]);

function toId(value: unknown) {
  return String(value);
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createCoverLabel(title: string) {
  const words = title
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9]/gi, ""))
    .filter(Boolean)
    .slice(0, 3);

  if (words.length === 0) {
    return "Book";
  }

  return words.map((word) => word[0]?.toUpperCase() ?? "").join("");
}

function deriveMarkerTone(slug: string, name: string): AdminSharedMarkerTone {
  const key = `${slug} ${name}`.toLowerCase();

  if (/(art|design)/.test(key)) {
    return "danger";
  }

  if (/(science|business)/.test(key)) {
    return "info";
  }

  if (/(history|literature)/.test(key)) {
    return "neutral";
  }

  if (/(technology|tech)/.test(key)) {
    return "success";
  }

  if (/(travel|philosophy)/.test(key)) {
    return "warning";
  }

  return "brand";
}

function deriveCoverTone(slug: string, name: string): BookRepositoryRecord["coverTone"] {
  const key = `${slug} ${name}`.toLowerCase();

  if (/(art|design)/.test(key)) {
    return "rose";
  }

  if (/(science|business)/.test(key)) {
    return "ocean";
  }

  if (/(travel)/.test(key)) {
    return "forest";
  }

  if (/(history|technology|tech)/.test(key)) {
    return "stone";
  }

  if (/(philosophy)/.test(key)) {
    return "amber";
  }

  return "brand";
}

function deriveMembershipLabel(role: UserRepositoryRecord["role"]) {
  return getAppRoleAccountLabel(role);
}

function deriveProfileNote(record: UserRepositoryRecord) {
  if (hasAdminAccessRole(record.role)) {
    return `${getAppRoleDisplayLabel(record.role)} account available for staff operations and account review.`;
  }

  if (record.status === "suspended") {
    return "Account currently suspended until circulation review is complete.";
  }

  return "Library member account synchronized from the application user store.";
}

function deriveBranchLabel(copyCode?: string) {
  const prefix = copyCode?.split("-")[0]?.toUpperCase();

  if (!prefix) {
    return "Main library desk";
  }

  return `${prefix} branch desk`;
}

function deriveShelfLabel(copyCode?: string) {
  const prefix = copyCode?.split("-")[0]?.toUpperCase();

  return prefix ? `${prefix} shelf` : "General shelf";
}

function deriveShelfCode(book: { title: string }, copies: ReadonlyArray<{ copyCode: string }>, fallback: string) {
  const primaryCode = copies[0]?.copyCode;

  if (primaryCode) {
    return primaryCode.split("-").slice(0, 2).join("-");
  }

  return `${fallback.toUpperCase().slice(0, 3) || "GEN"}-${slugify(book.title)
    .slice(0, 4)
    .toUpperCase()}`;
}

function mapPaymentStatus(record: BorrowRequestDocument): BorrowRequestRepositoryRecord["paymentStatus"] {
  if (record.paymentStatus === "paid") {
    return "cash-settled";
  }

  if (record.feeCents === 0 || record.paymentStatus === "waived") {
    return "not-required";
  }

  return "cash-due";
}

function createMockSnapshot(): LibrarySnapshot {
  return {
    bookCopies: listBookCopyRecords(),
    books: listBookRecords(),
    borrowRequests: listBorrowRequestRecords(),
    categories: listCategoryRecords(),
    users: listUserRecords(),
  };
}

export const getLibrarySnapshot = cache(async (): Promise<LibrarySnapshot> => {
  if (!isMongoConfigured()) {
    return createMockSnapshot();
  }

  try {
    const [categoriesCollection, booksCollection, bookCopiesCollection, usersCollection, borrowRequestsCollection] =
      await Promise.all([
        getCategoriesCollection(),
        getBooksCollection(),
        getBookCopiesCollection(),
        getUsersCollection(),
        getBorrowRequestsCollection(),
      ]);

    const [categoryDocs, bookDocs, copyDocs, userDocs, borrowRequestDocs] = await Promise.all([
      categoriesCollection.find({}).sort({ name: 1 }).toArray(),
      booksCollection.find({}).sort({ title: 1 }).toArray(),
      bookCopiesCollection.find({}).sort({ copyCode: 1 }).toArray(),
      usersCollection.find({}).sort({ name: 1 }).toArray(),
      borrowRequestsCollection.find({}).sort({ requestedAt: -1 }).toArray(),
    ]);

    const categories: CategoryRepositoryRecord[] = categoryDocs.map((category) => {
      const slug = category.slug?.trim() || slugify(category.name);

      return {
        description: category.description ?? "",
        iconKey: slug,
        id: toId(category._id),
        markerTone: deriveMarkerTone(slug, category.name),
        name: category.name,
        slug,
      };
    });

    const categoryById = new Map(categories.map((category) => [category.id, category]));

    const bookCopies: BookCopyRepositoryRecord[] = copyDocs.map((copy) => ({
      bookId: toId(copy.bookId),
      branch: deriveBranchLabel(copy.copyCode),
      condition: copy.condition,
      copyCode: copy.copyCode,
      id: toId(copy._id),
      locationNote: copy.notes,
      shelfLabel: deriveShelfLabel(copy.copyCode),
      status: copy.status,
      updatedOn: (copy.updatedAt ?? copy.createdAt ?? new Date()).toISOString(),
    }));

    const bookCopiesByBookId = new Map<string, BookCopyRepositoryRecord[]>();

    for (const copy of bookCopies) {
      const records = bookCopiesByBookId.get(copy.bookId) ?? [];
      records.push(copy);
      bookCopiesByBookId.set(copy.bookId, records);
    }

    const books: BookRepositoryRecord[] = bookDocs.map((book) => {
      const bookId = toId(book._id);
      const category = categoryById.get(toId(book.categoryId));
      const copies = bookCopiesByBookId.get(bookId) ?? [];
      const categorySlug = category?.slug ?? "general";
      const categoryName = category?.name ?? "General";

      return {
        allowCustomDuration: book.allowCustomDuration,
        author: book.author,
        categoryId: toId(book.categoryId),
        coverImageFileName:
          book.coverImageUrl?.split("/").pop() ?? `${slugify(book.title) || "book"}.jpg`,
        coverLabel: createCoverLabel(book.title),
        coverTone: deriveCoverTone(categorySlug, categoryName),
        description: book.description,
        feeCents: book.feeCents,
        id: bookId,
        isbn: book.isbn,
        metadata: {
          edition: book.metadata?.edition ?? "",
          language: book.metadata?.language ?? "English",
          publishedYear: book.metadata?.publishedYear ?? "",
          publisher: book.metadata?.publisher ?? "",
        },
        predefinedDurations: book.predefinedDurations as ReadonlyArray<AdminSharedDurationPreset>,
        recordStatus: book.status,
        shelfCode: deriveShelfCode(book, copies, categorySlug),
        title: book.title,
      };
    });

    const users: UserRepositoryRecord[] = userDocs.map((user) => {
      const role = user.role;
      const managementRole = hasAdminAccessRole(role) ? "admin" : "user";
      const joinedOn = (user.createdAt ?? user.lastLoginAt ?? new Date()).toISOString();
      const membershipLabel = deriveMembershipLabel(role);

      return {
        access: user.access,
        auth0UserId: user.auth0UserId,
        email: user.email,
        fullName: user.name,
        id: toId(user._id),
        joinedOn,
        managementRole,
        membershipLabel,
        profileNote: deriveProfileNote({
          auth0UserId: user.auth0UserId,
          email: user.email,
          fullName: user.name,
          id: toId(user._id),
          joinedOn,
          managementRole,
          membershipLabel,
          profileNote: "",
          role,
          status: user.status,
          subtitle: membershipLabel,
          visibleInAdminDirectory: true,
        }),
        role,
        status: user.status,
        subtitle: membershipLabel,
        visibleInAdminDirectory: true,
      };
    });

    const copyById = new Map(bookCopies.map((copy) => [copy.id, copy]));

    const borrowRequests: BorrowRequestRepositoryRecord[] = borrowRequestDocs
      .filter((record) => supportedBorrowStatuses.has(record.status))
      .map((record) => {
        const copy = copyById.get(toId(record.bookCopyId));
        const durationDays =
          record.approvedDurationDays ?? record.requestedDurationDays;
        const derivedDueAt = record.dueAt
          ? record.dueAt.toISOString()
          : record.startedAt
            ? new Date(
                record.startedAt.getTime() + durationDays * 24 * 60 * 60 * 1000,
              ).toISOString()
            : undefined;
        const effectiveStatus =
          record.status === "active" &&
          derivedDueAt &&
          new Date(derivedDueAt).getTime() < Date.now()
            ? "overdue"
            : record.status;

        return {
          bookId: toId(record.bookId),
          bookCopyId: toId(record.bookCopyId),
          branch: copy?.branch ?? deriveBranchLabel(copy?.copyCode),
          customDuration: record.durationType === "custom",
          durationDays,
          feeCents: record.feeCents,
          id: toId(record._id),
          note: record.notes,
          paymentStatus: mapPaymentStatus(record),
          requestedOn: record.requestedAt.toISOString(),
          returnedOn: record.returnedAt?.toISOString(),
          startedOn: record.startedAt?.toISOString(),
          status: effectiveStatus as BorrowRequestRepositoryRecord["status"],
          userId: toId(record.userId),
        };
      });

    return {
      bookCopies,
      books,
      borrowRequests,
      categories,
      users,
    };
  } catch (error) {
    console.error("Failed to load Mongo-backed library snapshot, falling back to mock data.", error);
    return createMockSnapshot();
  }
});

export async function listCategoryRecordsFromStore() {
  return (await getLibrarySnapshot()).categories;
}

export async function getCategoryRecordByIdFromStore(categoryId: string) {
  return (await getLibrarySnapshot()).categories.find((category) => category.id === categoryId) ?? null;
}

export async function listBookRecordsFromStore() {
  return (await getLibrarySnapshot()).books;
}

export async function getBookRecordByIdFromStore(bookId: string) {
  return (await getLibrarySnapshot()).books.find((book) => book.id === bookId) ?? null;
}

export async function listBookRecordsByCategoryFromStore(categoryId: string) {
  return (await getLibrarySnapshot()).books.filter((book) => book.categoryId === categoryId);
}

export async function countBookRecordsByCategoryFromStore(categoryId: string) {
  return (await listBookRecordsByCategoryFromStore(categoryId)).length;
}

export async function listBookCopyRecordsFromStore() {
  return (await getLibrarySnapshot()).bookCopies;
}

export async function getBookCopyRecordByIdFromStore(copyId: string) {
  return (await getLibrarySnapshot()).bookCopies.find((copy) => copy.id === copyId) ?? null;
}

export async function listBookCopyRecordsForBookFromStore(bookId: string) {
  return (await getLibrarySnapshot()).bookCopies.filter((copy) => copy.bookId === bookId);
}

export async function listBorrowRequestRecordsFromStore() {
  return (await getLibrarySnapshot()).borrowRequests;
}

export async function getBorrowRequestRecordByIdFromStore(requestId: string) {
  return (await getLibrarySnapshot()).borrowRequests.find((record) => record.id === requestId) ?? null;
}

export async function listBorrowRequestRecordsForBookFromStore(bookId: string) {
  return (await getLibrarySnapshot()).borrowRequests.filter((record) => record.bookId === bookId);
}

export async function listBorrowRequestRecordsForUserFromStore(userId: string) {
  return (await getLibrarySnapshot()).borrowRequests.filter((record) => record.userId === userId);
}

export async function listUserRecordsFromStore() {
  return (await getLibrarySnapshot()).users;
}

export async function listVisibleUserRecordsFromStore() {
  return (await getLibrarySnapshot()).users.filter((user) => user.visibleInAdminDirectory);
}

export async function getUserRecordByIdFromStore(userId: string) {
  return (await getLibrarySnapshot()).users.find((user) => user.id === userId) ?? null;
}

export async function getBookInventorySnapshotFromStore(bookId: string): Promise<BookInventorySnapshot> {
  const [copies, book] = await Promise.all([
    listBookCopyRecordsForBookFromStore(bookId),
    getBookRecordByIdFromStore(bookId),
  ]);
  const updatedTimestamps = copies
    .map((copy) => copy.updatedOn)
    .sort((left, right) => right.localeCompare(left));
  const availableCopies = copies.filter((copy) => copy.status === "available").length;
  const borrowedCopies = copies.filter((copy) => copy.status === "borrowed").length;
  const reservedCopies = copies.filter((copy) => copy.status === "reserved").length;

  return {
    availableCopies,
    borrowedCopies,
    lastUpdatedOn: updatedTimestamps[0] ?? null,
    reservedCopies,
    shelfCode: book?.shelfCode ?? "Unassigned",
    totalCopies: copies.length,
  };
}

export async function getStoredCategoryRecordById(categoryId: string) {
  return isMongoConfigured()
    ? getCategoryRecordByIdFromStore(categoryId)
    : getCategoryRecordById(categoryId);
}

export async function getStoredBookRecordById(bookId: string) {
  return isMongoConfigured() ? getBookRecordByIdFromStore(bookId) : getBookRecordById(bookId);
}

export async function getStoredBookCopyRecordById(copyId: string) {
  return isMongoConfigured()
    ? getBookCopyRecordByIdFromStore(copyId)
    : getBookCopyRecordById(copyId);
}

export async function listStoredBookCopyRecordsForBook(bookId: string) {
  return isMongoConfigured()
    ? listBookCopyRecordsForBookFromStore(bookId)
    : listBookCopyRecordsForBook(bookId);
}

export async function listStoredBorrowRequestRecordsForUser(userId: string) {
  return isMongoConfigured()
    ? listBorrowRequestRecordsForUserFromStore(userId)
    : listBorrowRequestRecordsForUser(userId);
}

export async function listStoredBorrowRequestRecords() {
  return isMongoConfigured() ? listBorrowRequestRecordsFromStore() : listBorrowRequestRecords();
}

export async function getStoredUserRecordById(userId: string) {
  return isMongoConfigured() ? getUserRecordByIdFromStore(userId) : getUserRecordById(userId);
}

export async function listStoredVisibleUserRecords() {
  return isMongoConfigured() ? listVisibleUserRecordsFromStore() : listVisibleUserRecords();
}

export async function countStoredBookRecordsByCategory(categoryId: string) {
  return isMongoConfigured()
    ? countBookRecordsByCategoryFromStore(categoryId)
    : countBookRecordsByCategory(categoryId);
}

export async function getStoredBookInventorySnapshot(bookId: string) {
  return isMongoConfigured()
    ? getBookInventorySnapshotFromStore(bookId)
    : getBookInventorySnapshot(bookId);
}

export async function listStoredBookRecordsByCategory(categoryId: string) {
  return isMongoConfigured()
    ? listBookRecordsByCategoryFromStore(categoryId)
    : listBookRecordsByCategory(categoryId);
}

export async function getStoredBorrowRequestRecordById(requestId: string) {
  return isMongoConfigured()
    ? getBorrowRequestRecordByIdFromStore(requestId)
    : getBorrowRequestRecordById(requestId);
}