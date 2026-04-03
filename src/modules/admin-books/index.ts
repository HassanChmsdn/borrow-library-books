export {
  AdminBookDetailsEmptyState,
  AdminBookDetailsLoadingState,
  AdminBookDetailsModule,
} from "./admin-book-details-module";
export { AdminBooksLoadingState, AdminBooksModule } from "./admin-books-module";
export { useAdminBooksModuleState } from "./hooks";
export {
  adminBookCreateDefaults,
  adminBookDetailRecords,
  adminBookDurationOptions,
  adminBooksCatalog,
  adminBooksCategories,
  createAdminBookFormValues,
  deriveAdminBookCoverTone,
  getAdminBookDetailsRecordById,
} from "./mock-data";
export {
  BookCoverUploader,
  BookDetailsForm,
  BookDurationSettings,
  BookFeeSettings,
  BookMetadataSection,
  BookTableRow,
  BooksTable,
  BooksToolbar,
} from "./components";

export type {
  AdminBookDetailsModuleProps,
  AdminBookDetailsRecord,
  AdminBookDurationOption,
  AdminBookFormFieldErrors,
  AdminBookFormMode,
  AdminBookFormStatus,
  AdminBookFormValues,
  AdminBookRecord,
  AdminBookCategory,
  AdminBooksCategory,
  AdminBooksModuleProps,
  AdminBooksSortValue,
  AdminBooksStatusFilter,
} from "./types";
