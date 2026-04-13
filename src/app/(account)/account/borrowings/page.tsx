import { cookies } from "next/headers";

import {
  MEMBER_AUTH_REGISTRATION_NAME_COOKIE,
  MEMBER_AUTH_SIGNUP_CONFIRMATION_PARAM,
  isMemberSignupConfirmationRequest,
  sanitizePendingMemberName,
} from "@/lib/auth/member-auth-flow";
import { getCurrentUserSession } from "@/lib/auth/server";
import { MyBorrowingsModule } from "@/modules/borrowings";
import { listPersistedBorrowingRecordsForUser } from "@/modules/borrowings/server";

interface AccountBorrowingsPageProps {
  searchParams: Promise<{
    [MEMBER_AUTH_SIGNUP_CONFIRMATION_PARAM]?: string;
  }>;
}

export const metadata = {
  title: "My Borrowings",
};

export default async function AccountBorrowingsPage({
  searchParams,
}: AccountBorrowingsPageProps) {
  const cookieStore = await cookies();
  const params = await searchParams;
  const currentUser = await getCurrentUserSession();
  const persistedRecords = currentUser
    ? await listPersistedBorrowingRecordsForUser(currentUser.id)
    : [];
  const signupConfirmationName = currentUser
    && isMemberSignupConfirmationRequest(
      params[MEMBER_AUTH_SIGNUP_CONFIRMATION_PARAM],
    )
    ? sanitizePendingMemberName(
        cookieStore.get(MEMBER_AUTH_REGISTRATION_NAME_COOKIE)?.value,
      )
    : null;

  return (
    <MyBorrowingsModule
      persistedRecords={persistedRecords}
      signupConfirmationName={signupConfirmationName}
    />
  );
}