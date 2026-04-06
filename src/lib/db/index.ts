export {
  getMongoClient,
  getMongoDatabaseName,
  isMongoConfigured,
} from "./client";

export {
  COLLECTIONS,
  getBookCopiesCollection,
  getBooksCollection,
  getBorrowRequestsCollection,
  getCategoriesCollection,
  getCollection,
  getCollections,
  getUsersCollection,
  type CollectionName,
  type MongoCollections,
} from "./collections";

export type {
  AppUserRole,
  AppUserStatus,
  BookCopyCondition,
  BookCopyDocument,
  BookCopyStatus,
  BookDocument,
  BookStatus,
  BorrowRequestDocument,
  BorrowRequestStatus,
  CategoryDocument,
  PaymentStatus,
  UserDocument,
} from "./models";