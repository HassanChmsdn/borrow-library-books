export {
  getCategoryRecordById,
  listCategoryRecords,
  type CategoryRepositoryRecord,
} from "./repositories/categories";

export {
  countBookRecordsByCategory,
  getBookInventorySnapshot,
  getBookRecordById,
  listBookRecords,
  listBookRecordsByCategory,
  type BookInventorySnapshot,
  type BookRepositoryRecord,
} from "./repositories/books";

export {
  getBookCopyRecordById,
  listBookCopyRecords,
  listBookCopyRecordsForBook,
  type BookCopyRepositoryRecord,
} from "./repositories/book-copies";

export {
  getBorrowRequestRecordById,
  listBorrowRequestRecords,
  listBorrowRequestRecordsForBook,
  listBorrowRequestRecordsForUser,
  type BorrowRequestRepositoryRecord,
} from "./repositories/borrow-requests";

export {
  findUserRecordByAuth0Subject,
  findUserRecordByMockRole,
  getUserRecordById,
  listUserRecords,
  listVisibleUserRecords,
  type UserRepositoryRecord,
} from "./repositories/users";
