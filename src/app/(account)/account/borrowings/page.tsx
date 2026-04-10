import { getCurrentUserSession } from "@/lib/auth/server";
import { MyBorrowingsModule } from "@/modules/borrowings";
import { listPersistedBorrowingRecordsForUser } from "@/modules/borrowings/server";

export const metadata = {
  title: "My Borrowings",
};

export default async function AccountBorrowingsPage() {
  const currentUser = await getCurrentUserSession();
  const persistedRecords = currentUser
    ? await listPersistedBorrowingRecordsForUser(currentUser.id)
    : [];

  return <MyBorrowingsModule persistedRecords={persistedRecords} />;
}