import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import type { BookCoverTone } from "./all-books-data";

const bookCoverAspectRatioStyle = {
  aspectRatio: "4 / 5",
} satisfies ComponentProps<"div">["style"];

const coverToneClasses: Record<
  BookCoverTone,
  { accent: string; body: string; text: string; meta: string }
> = {
  amber: {
    accent: "bg-brand-500",
    body: "bg-brand-100",
    text: "text-brand-900",
    meta: "text-brand-800/80",
  },
  brand: {
    accent: "bg-brand-700",
    body: "bg-brand-200",
    text: "text-brand-900",
    meta: "text-brand-800/80",
  },
  forest: {
    accent: "bg-success",
    body: "bg-success-surface",
    text: "text-success",
    meta: "text-success/80",
  },
  ocean: {
    accent: "bg-info",
    body: "bg-info-surface",
    text: "text-info",
    meta: "text-info/80",
  },
  rose: {
    accent: "bg-danger",
    body: "bg-danger-surface",
    text: "text-danger",
    meta: "text-danger/80",
  },
  stone: {
    accent: "bg-stone-700",
    body: "bg-stone-100",
    text: "text-stone-900",
    meta: "text-stone-700/80",
  },
};

interface BookCoverArtProps extends ComponentProps<"div"> {
  author: string;
  coverLabel: string;
  title: string;
  tone: BookCoverTone;
  size?: "card" | "detail";
}

function BookCoverArt({
  author,
  className,
  coverLabel,
  title,
  tone,
  size = "card",
  ...props
}: BookCoverArtProps) {
  const coverTone = coverToneClasses[tone];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-black/5 shadow-xs",
        coverTone.body,
        size === "detail" ? "p-5 sm:p-6" : "p-4",
        className,
      )}
      style={bookCoverAspectRatioStyle}
      {...props}
    >
      <div className={cn("absolute inset-y-0 left-0 w-3", coverTone.accent)} />
      <div
        className={cn(
          "flex h-full flex-col justify-between",
          size === "detail" ? "pl-5 sm:pl-6" : "pl-4",
        )}
      >
        <p
          className={cn(
            "text-caption font-medium tracking-[0.18em] uppercase",
            coverTone.meta,
          )}
        >
          {coverLabel}
        </p>

        <div className={cn(size === "detail" ? "space-y-3" : "space-y-2")}>
          <h2
            className={cn(
              "font-semibold text-balance",
              coverTone.text,
              size === "detail"
                ? "text-2xl leading-tight sm:text-3xl"
                : "text-base leading-snug",
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              size === "detail" ? "text-body" : "text-caption",
              coverTone.meta,
            )}
          >
            {author}
          </p>
        </div>
      </div>
    </div>
  );
}

export { BookCoverArt, type BookCoverArtProps };
