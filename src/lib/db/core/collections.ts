import type { Collection, Document } from "mongodb";

import { getMongoClient, getMongoDatabaseName } from "./client";
import type {
  AccessPolicyDocument,
  BookCopyDocument,
  BookDocument,
  BorrowRequestDocument,
  CategoryDocument,
  UserDocument,
} from "../models";

export const COLLECTIONS = {
  accessPolicies: "accessPolicies",
  bookCopies: "bookCopies",
  books: "books",
  borrowRequests: "borrowRequests",
  categories: "categories",
  users: "users",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

async function getDatabase() {
  const client = await getMongoClient();

  return client.db(getMongoDatabaseName());
}

export async function getCollection<TDocument extends Document>(
  name: CollectionName,
) {
  const db = await getDatabase();

  return db.collection<TDocument>(name);
}

export function getUsersCollection() {
  return getCollection<UserDocument>(COLLECTIONS.users);
}

export function getAccessPoliciesCollection() {
  return getCollection<AccessPolicyDocument>(COLLECTIONS.accessPolicies);
}

export function getCategoriesCollection() {
  return getCollection<CategoryDocument>(COLLECTIONS.categories);
}

export function getBooksCollection() {
  return getCollection<BookDocument>(COLLECTIONS.books);
}

export function getBookCopiesCollection() {
  return getCollection<BookCopyDocument>(COLLECTIONS.bookCopies);
}

export function getBorrowRequestsCollection() {
  return getCollection<BorrowRequestDocument>(COLLECTIONS.borrowRequests);
}

export interface MongoCollections {
  accessPolicies: Promise<Collection<AccessPolicyDocument>>;
  bookCopies: Promise<Collection<BookCopyDocument>>;
  books: Promise<Collection<BookDocument>>;
  borrowRequests: Promise<Collection<BorrowRequestDocument>>;
  categories: Promise<Collection<CategoryDocument>>;
  users: Promise<Collection<UserDocument>>;
}

export function getCollections(): MongoCollections {
  return {
    accessPolicies: getAccessPoliciesCollection(),
    bookCopies: getBookCopiesCollection(),
    books: getBooksCollection(),
    borrowRequests: getBorrowRequestsCollection(),
    categories: getCategoriesCollection(),
    users: getUsersCollection(),
  };
}
