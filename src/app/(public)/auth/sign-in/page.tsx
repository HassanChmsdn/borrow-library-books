import { redirect } from "next/navigation";

import { MemberAuthPanel } from "@/components/auth/member-auth-panel";

import {
  getCurrentRole,
  getRouteAuthorization,
  hasAdminAccess,
  isAuthenticated,
  sanitizeRedirectTo,
} from "@/lib/auth";
import { buildMemberSignupConfirmationRedirect } from "@/lib/auth/member-auth-flow";
import { PageHeader } from "@/components/layout";
import {
  buildAuth0LoginHref,
  buildAuth0SignupHref,
  isAuth0Configured,
} from "@/lib/auth/auth0";
import { getCurrentSession } from "@/lib/auth/server";
import { getI18n } from "@/lib/i18n/server";

interface SignInPageProps {
  searchParams: Promise<{
    error?: string;
    mode?: string;
    redirectTo?: string;
  }>;
}

export const metadata = {
  title: "Member Sign In",
};

function getMemberAuthErrorMessage(
  error: string | undefined,
  translateText: (text: string) => string,
) {
  if (error === "auth0-not-configured") {
    return translateText(
      "Member authentication is unavailable until Auth0 is configured for this environment.",
    );
  }

  return null;
}

function sanitizeMemberAuthMode(mode?: string) {
  return mode === "register" ? "register" : "login";
}

export default async function MemberSignInPage({ searchParams }: SignInPageProps) {
  const { translateText } = await getI18n();
  const params = await searchParams;
  const mode = sanitizeMemberAuthMode(params.mode);
  const redirectTo = sanitizeRedirectTo(params.redirectTo, "/books");
  const signupRedirectTo = buildMemberSignupConfirmationRedirect(redirectTo);
  const errorMessage = getMemberAuthErrorMessage(params.error, translateText);
  const session = await getCurrentSession();

  if (isAuthenticated(session)) {
    const currentRole = getCurrentRole(session);
    const authorization = getRouteAuthorization(session, redirectTo);

    if (currentRole !== "guest" && authorization.isAllowed) {
      redirect(redirectTo);
    }

    if (currentRole !== "guest") {
      redirect(hasAdminAccess(session) ? "/admin" : "/books");
    }
  }

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Authentication"
        title="Member sign in"
        description="Choose whether you want to sign in or start a new member registration, then continue on the secure Auth0 page for the actual authentication step."
      />

      <section style={{ maxWidth: "var(--layout-reading-max-width)" }}>
        <MemberAuthPanel
          auth0Enabled={isAuth0Configured()}
          errorMessage={errorMessage}
          loginHref={buildAuth0LoginHref({ returnTo: redirectTo })}
          mode={mode}
          redirectTo={redirectTo}
          signupHref={buildAuth0SignupHref({ returnTo: signupRedirectTo })}
        />
      </section>
    </div>
  );
}