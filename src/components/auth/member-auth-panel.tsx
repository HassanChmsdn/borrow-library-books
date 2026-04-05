"use client";

import { startTransition, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogIn, UserPlus } from "lucide-react";

import { buildMockAuthorizeHref, type MockAuthRole } from "@/lib/auth";
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
  email: string;
  password: string;
  confirmPassword: string;
}

type MemberAuthErrors = Partial<Record<keyof MemberAuthValues | "form", string>>;

interface MemberAuthPanelProps {
  currentRole: MockAuthRole;
  currentUserName: string | null;
  redirectTo: string;
}

const defaultValues: MemberAuthValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function MemberAuthPanel({
  currentRole,
  currentUserName,
  redirectTo,
}: MemberAuthPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<MemberAuthMode>("login");
  const [values, setValues] = useState<MemberAuthValues>(defaultValues);
  const [errors, setErrors] = useState<MemberAuthErrors>({});
  const [isPending, setIsPending] = useState(false);

  const helperCopy = useMemo(() => {
    if (currentRole === "admin") {
      return "You are currently using the mocked admin session. Continuing here will replace it with a mocked member session for borrowing flows.";
    }

    if (currentRole === "member") {
      return `${currentUserName ?? "This mocked member account"} is already signed in. Submitting again will refresh member access for the requested destination.`;
    }

    return "Borrowing and account routes require a mocked member session for now. Public catalog browsing remains available without signing in.";
  }, [currentRole, currentUserName]);

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
    const nextErrors: MemberAuthErrors = {};
    const trimmedEmail = values.email.trim();

    if (mode === "register" && !values.fullName.trim()) {
      nextErrors.fullName = "Enter the full name that should be attached to the member account.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Enter an email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Enter a password.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Use at least 8 characters for the mocked credential.";
    }

    if (mode === "register") {
      if (!values.confirmPassword) {
        nextErrors.confirmPassword = "Confirm the password to continue.";
      } else if (values.confirmPassword !== values.password) {
        nextErrors.confirmPassword = "The passwords do not match.";
      }
    }

    return nextErrors;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsPending(true);

    startTransition(() => {
      router.push(buildMockAuthorizeHref("member", redirectTo));
    });
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap gap-2">
          {(["login", "register"] as const).map((option) => {
            const active = mode === option;
            return (
              <button
                key={option}
                className={cn(
                  "rounded-pill text-label inline-flex h-10 items-center gap-2 border px-4 transition-colors",
                  active
                    ? "border-border-strong bg-elevated text-foreground shadow-xs"
                    : "border-border-subtle bg-card text-text-secondary hover:border-border-strong hover:text-foreground",
                )}
                onClick={() => {
                  setMode(option);
                  setErrors({});
                }}
                type="button"
              >
                {option === "login" ? (
                  <LogIn className="size-4" />
                ) : (
                  <UserPlus className="size-4" />
                )}
                {option === "login" ? "Login" : "Register"}
              </button>
            );
          })}
        </div>

        <div>
          <CardTitle>
            {mode === "login" ? "Sign in to borrow" : "Create a member account"}
          </CardTitle>
          <CardDescription className="mt-2">{helperCopy}</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form className="grid gap-4" noValidate onSubmit={onSubmit}>
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
                  This mocked value is only used to mirror a future profile field.
                </span>
              )}
            </label>
          ) : null}

          <label className="grid gap-2">
            <span className="text-label text-foreground font-medium">Email</span>
            <Input
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              disabled={isPending}
              onChange={(event) => updateValue("email", event.target.value)}
              placeholder="sara.chehab@library.test"
              type="email"
              value={values.email}
            />
            {errors.email ? (
              <span className="text-body-sm text-danger">{errors.email}</span>
            ) : (
              <span className="text-body-sm text-text-tertiary">
                Use any valid email format. Credentials are not verified against a real backend yet.
              </span>
            )}
          </label>

          <label className="grid gap-2">
            <span className="text-label text-foreground font-medium">Password</span>
            <Input
              aria-invalid={Boolean(errors.password)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              disabled={isPending}
              onChange={(event) => updateValue("password", event.target.value)}
              placeholder="At least 8 characters"
              type="password"
              value={values.password}
            />
            {errors.password ? (
              <span className="text-body-sm text-danger">{errors.password}</span>
            ) : (
              <span className="text-body-sm text-text-tertiary">
                Mocked credentials only. This field is present to keep the future Auth0-ready form structure realistic.
              </span>
            )}
          </label>

          {mode === "register" ? (
            <label className="grid gap-2">
              <span className="text-label text-foreground font-medium">Confirm password</span>
              <Input
                aria-invalid={Boolean(errors.confirmPassword)}
                autoComplete="new-password"
                disabled={isPending}
                onChange={(event) => updateValue("confirmPassword", event.target.value)}
                placeholder="Repeat the password"
                type="password"
                value={values.confirmPassword}
              />
              {errors.confirmPassword ? (
                <span className="text-body-sm text-danger">{errors.confirmPassword}</span>
              ) : (
                <span className="text-body-sm text-text-tertiary">
                  Matching passwords keep the mocked register flow aligned with a future production form.
                </span>
              )}
            </label>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button className="sm:min-w-44" disabled={isPending} type="submit">
              {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {isPending
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Login"
                  : "Register"}
            </Button>

            <Button asChild disabled={isPending} type="button" variant="ghost">
              <Link href="/books">Keep browsing</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}