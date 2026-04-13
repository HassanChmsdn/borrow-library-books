"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle, LogIn, UserPlus } from "lucide-react";

import {
  MEMBER_AUTH_REGISTRATION_NAME_COOKIE,
  sanitizePendingMemberName,
} from "@/lib/auth/member-auth-flow";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type MemberAuthMode = "login" | "register";

interface MemberAuthValues {
  fullName: string;
}

type MemberAuthErrors = Partial<Record<keyof MemberAuthValues | "form", string>>;

interface MemberAuthPanelProps {
  auth0Enabled: boolean;
  errorMessage?: string | null;
  loginHref: string;
  mode: MemberAuthMode;
  redirectTo: string;
  signupHref: string;
}

const defaultValues: MemberAuthValues = {
  fullName: "",
};

export function MemberAuthPanel({
  auth0Enabled,
  errorMessage,
  loginHref,
  mode,
  redirectTo,
  signupHref,
}: MemberAuthPanelProps) {
  const [values, setValues] = useState<MemberAuthValues>(defaultValues);
  const [errors, setErrors] = useState<MemberAuthErrors>({});
  const [isPending, setIsPending] = useState(false);

  const currentAuthHref = mode === "login" ? loginHref : signupHref;
  const heading = mode === "login" ? "Sign in to borrow" : "Create a member account";
  const loginTabHref = `/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`;
  const registerTabHref = `/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}&mode=register`;
  const helperCopy = !auth0Enabled
    ? "Auth0 must be configured before members can continue through the shared sign-in experience."
    : mode === "login"
      ? "Continue on the secure Auth0 page to enter your credentials and complete member sign-in."
      : "Share the member name you want attached to the account, then finish registration on the secure Auth0 page.";

  function updateValue(field: keyof MemberAuthValues, nextValue: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: nextValue,
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[field] && !currentErrors.form) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      delete nextErrors.form;
      return nextErrors;
    });
  }

  function validate(): MemberAuthErrors {
    if (mode !== "register") {
      return {};
    }

    return sanitizePendingMemberName(values.fullName)
      ? {}
      : {
          fullName: "Enter the full name you want ready for post-signup profile completion.",
        };
  }

  function startNavigation(baseHref: string) {
    setIsPending(true);

    if (mode === "register") {
      const pendingName = sanitizePendingMemberName(values.fullName);

      if (pendingName) {
        // Preserve the member name across the Auth0 roundtrip so first app-user provisioning can reuse it.
        document.cookie = `${MEMBER_AUTH_REGISTRATION_NAME_COOKIE}=${encodeURIComponent(pendingName)}; Max-Age=1800; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
      }
    }

    window.location.assign(baseHref);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    if (!auth0Enabled) {
      setErrors({
        form: "Auth0 is not configured for this environment yet.",
      });
      return;
    }

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    startNavigation(currentAuthHref);
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap gap-2">
          {(["login", "register"] as const).map((option) => {
            const active = mode === option;
            const href = option === "login" ? loginTabHref : registerTabHref;
            return (
              <Link
                href={href}
                key={option}
                className={cn(
                  "rounded-pill text-label inline-flex h-10 items-center gap-2 border px-4 transition-colors",
                  active
                    ? "border-border-strong bg-elevated text-foreground shadow-xs"
                    : "border-border-subtle bg-card text-text-secondary hover:border-border-strong hover:text-foreground",
                )}
              >
                {option === "login" ? (
                  <LogIn className="size-4" />
                ) : (
                  <UserPlus className="size-4" />
                )}
                {option === "login" ? "Login" : "Register"}
              </Link>
            );
          })}
        </div>

        <div>
          <CardTitle>{heading}</CardTitle>
          <CardDescription className="mt-2 max-w-prose">{helperCopy}</CardDescription>
          <p className="text-body-sm text-text-tertiary mt-3 break-all">
            After Auth0 completes, you will return to {redirectTo}.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form className="grid gap-4" noValidate onSubmit={onSubmit}>
          {errorMessage ? (
            <div className="rounded-2xl border border-danger/20 bg-danger-surface px-4 py-3">
              <p className="text-body-sm text-danger font-medium">{errorMessage}</p>
            </div>
          ) : null}

          {errors.form ? (
            <div className="rounded-2xl border border-danger/20 bg-danger-surface px-4 py-3">
              <p className="text-body-sm text-danger font-medium">{errors.form}</p>
            </div>
          ) : null}

          {mode === "register" ? (
            <label className="grid gap-2">
              <span className="text-label text-foreground font-medium">Full name</span>
              <Input
                aria-invalid={Boolean(errors.fullName)}
                autoComplete="name"
                disabled={isPending}
                onChange={(event) => updateValue("fullName", event.target.value)}
                placeholder="Sara Chehab"
                type="text"
                value={values.fullName}
              />
              {errors.fullName ? (
                <span className="text-body-sm text-danger">{errors.fullName}</span>
              ) : (
                <span className="text-body-sm text-text-tertiary">
                  We keep this name in the app flow so the member record can be created cleanly after Auth0 finishes signup.
                </span>
              )}
            </label>
          ) : null}

          <div className="rounded-2xl border border-dashed border-black/5 p-4">
            <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
              Secure authentication
            </p>
            <p className="text-body-sm text-text-secondary mt-2">
              {mode === "login"
                ? "Credentials and any enabled social sign-in options are handled on the Auth0-hosted page."
                : "Password setup, verification, and any enabled social signup options are completed on the Auth0-hosted page."}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            {mode === "login" ? (
              <Button asChild className="sm:min-w-44">
                <a href={loginHref}>
                  Continue to login
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            ) : (
              <Button className="sm:min-w-44" disabled={isPending} type="submit">
                {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {isPending ? "Redirecting to register..." : "Continue to register"}
                {!isPending ? <ArrowRight className="size-4" /> : null}
              </Button>
            )}

            <Button asChild disabled={mode === "register" && isPending} type="button" variant="ghost">
              <Link href="/books">Keep browsing</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}