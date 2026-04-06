import "server-only";

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
} from "./core/collections";