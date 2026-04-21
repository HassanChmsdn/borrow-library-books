"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/lib/i18n";
import { supportedLocales, type AppLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function LanguageSwitcher() {
  const router = useRouter();
  const { locale, messages } = useI18n();
  const [isPending, setIsPending] = useState(false);

  async function setLocale(nextLocale: AppLocale) {
    setIsPending(true);

    try {
      const response = await fetch("/api/locale", {
        body: JSON.stringify({ locale: nextLocale }),
        credentials: "same-origin",
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <label className="grid gap-1.5">
      <span className="text-caption text-text-tertiary hidden font-medium tracking-[0.18em] uppercase sm:inline">
        {messages.ui.languageSwitcher.label}
      </span>
      <select
        aria-label={messages.ui.languageSwitcher.selectLabel}
        className={cn(
          "rounded-input border-input bg-card text-body-sm text-foreground focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring h-9 min-w-[9rem] border px-3 shadow-xs outline-none focus-visible:ring-4",
          isPending ? "cursor-wait" : undefined,
        )}
        disabled={isPending}
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value as AppLocale;

          if (nextLocale !== locale) {
            void setLocale(nextLocale);
          }
        }}
      >
        {supportedLocales.map((nextLocale) => (
          <option key={nextLocale} value={nextLocale}>
            {messages.ui.languageSwitcher.locales[nextLocale]}
          </option>
        ))}
      </select>
    </label>
  );
}

export { LanguageSwitcher };