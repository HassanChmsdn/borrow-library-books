import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[radial-gradient(circle_at_top,_theme(colors.slate.100),_transparent_45%),linear-gradient(180deg,_theme(colors.white),_theme(colors.slate.50))] px-6 py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-[0_30px_120px_-48px_rgba(15,23,42,0.45)] backdrop-blur md:p-12">
        <div className="space-y-5">
          <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium tracking-[0.24em] text-slate-600 uppercase">
            Platform foundation
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Borrow Library Books
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              The application scaffold is ready with the App Router, Tailwind
              CSS, ESLint, Prettier, validated environment loading, and
              shadcn/ui. Build features inside isolated modules without changing
              the platform foundation.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm font-medium text-slate-900">Routing</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              App Router lives in <code>@/app</code> with source code isolated
              under
              <code>src</code>.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm font-medium text-slate-900">UI foundation</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tailwind CSS 4 and shadcn/ui are configured for reusable
              components.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm font-medium text-slate-900">Quality gates</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              ESLint, Prettier, type-checking, and environment validation are
              ready.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link
              href="https://nextjs.org/docs/app"
              target="_blank"
              rel="noreferrer"
            >
              Review App Router docs
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link
              href="https://ui.shadcn.com/docs"
              target="_blank"
              rel="noreferrer"
            >
              Review shadcn docs
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
