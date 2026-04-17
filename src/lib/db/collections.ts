import "server-only";

export {
  COLLECTIONS,
  getAccessPoliciesCollection,
  getBookCopiesCollection,
  getBooksCollection,
  getBorrowRequestsCollection,
  getCategoriesCollection,
  getCollection,
  getCollections,
  getUsersCollection,
  type CollectionName,
  type MongoCollections,
} from "./core/collections";