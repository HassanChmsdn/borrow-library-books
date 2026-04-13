export const MEMBER_AUTH_REGISTRATION_NAME_COOKIE = "borrow-library-member-name";
export const MEMBER_AUTH_SIGNUP_CONFIRMATION_PARAM = "member-auth";
export const MEMBER_AUTH_SIGNUP_CONFIRMATION_VALUE = "signup-complete";

export function sanitizePendingMemberName(value?: string | null) {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim().replace(/\s+/g, " ");

  if (normalizedValue.length < 2) {
    return null;
  }

  return normalizedValue.slice(0, 120);
}

export function buildMemberSignupConfirmationRedirect(redirectTo: string) {
  const url = new URL(redirectTo, "https://borrow-library-books.local");

  url.searchParams.set(
    MEMBER_AUTH_SIGNUP_CONFIRMATION_PARAM,
    MEMBER_AUTH_SIGNUP_CONFIRMATION_VALUE,
  );

  return `${url.pathname}${url.search}${url.hash}`;
}

export function isMemberSignupConfirmationRequest(value?: string | null) {
  return value === MEMBER_AUTH_SIGNUP_CONFIRMATION_VALUE;
}