import { redirect } from "next/navigation";

export const metadata = {
  title: "My Borrowings",
};

export default function MyBorrowingsPage() {
  redirect("/account/borrowings");
}
