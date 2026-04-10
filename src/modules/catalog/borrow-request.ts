export interface BookBorrowRequestState {
  message?: string;
  status: "error" | "idle" | "success";
}

export const initialBookBorrowRequestState: BookBorrowRequestState = {
  status: "idle",
};