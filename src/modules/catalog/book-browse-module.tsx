import Link from "next/link";

import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  borrowingSnapshots,
  catalogBooks,
  catalogCategories,
  profileHighlights,
  type CatalogStatusTone,
} from "./data";

const statusToneClasses: Record<CatalogStatusTone, string> = {
  success:
    "border-success-border bg-success-surface text-success inline-flex items-center rounded-pill border px-2.5 py-1",
  warning:
    "border-warning-border bg-warning-surface text-warning inline-flex items-center rounded-pill border px-2.5 py-1",
  danger:
    "border-danger-border bg-danger-surface text-danger inline-flex items-center rounded-pill border px-2.5 py-1",
};

function BookBrowseModule() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Browse"
        title="Browse Books"
        description="Discover and borrow from our collection of 12 books. The module stays static for now, but the information architecture is ready for real catalog logic later."
        actions={
          <>
            <Button asChild size="sm" variant="outline">
              <Link href="#my-borrowings">My Borrowings</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="#profile">Profile</Link>
            </Button>
          </>
        }
      >
        <div className="rounded-card border-border-subtle bg-card grid gap-3 border p-4 shadow-xs sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
          <Input
            aria-label="Search catalog preview"
            placeholder="Search by title or author..."
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" type="button" variant="secondary">
              Sort: Popularity
            </Button>
            <Button size="sm" type="button" variant="outline">
              Filters Preview
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2">
            {catalogCategories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={cn(
                  "rounded-pill text-label inline-flex min-h-9 items-center border px-4 font-medium transition-colors duration-200",
                  index === 0
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border-subtle bg-card text-text-secondary hover:bg-secondary hover:text-foreground",
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      <section
        id="browse"
        aria-labelledby="browse-books-title"
        className="space-y-4"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="browse-books-title"
              className="text-title-sm text-foreground font-semibold"
            >
              Collection Highlights
            </h2>
            <p className="text-body-sm text-text-secondary">
              12 books found across the categories surfaced in the design token
              source.
            </p>
          </div>

          <p className="text-label text-text-tertiary font-medium tracking-[0.18em] uppercase">
            Static catalog preview
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {catalogBooks.map((book) => (
            <Card key={book.title} className="overflow-hidden">
              <CardHeader className="gap-4">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "text-caption font-medium tracking-[0.18em] uppercase",
                      statusToneClasses[book.statusTone],
                    )}
                  >
                    {book.statusLabel}
                  </span>
                  <span className="text-caption text-warning font-medium tracking-[0.18em] uppercase">
                    {book.feeLabel}
                  </span>
                </div>

                <div className="space-y-1">
                  <CardTitle>{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="border-border-subtle flex items-center justify-between gap-3 border-t border-dashed pt-4">
                <div>
                  <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                    {book.category}
                  </p>
                  <p className="text-body-sm text-text-secondary mt-1">
                    {book.availability}
                  </p>
                </div>

                <Button size="sm" type="button" variant="outline">
                  View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="my-borrowings"
        aria-labelledby="my-borrowings-title"
        className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]"
      >
        <Card>
          <CardHeader>
            <CardTitle id="my-borrowings-title">My Borrowings</CardTitle>
            <CardDescription>
              A static snapshot of the future reader dashboard, structured as a
              reusable public module instead of page-local markup.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {borrowingSnapshots.map((item) => (
              <div
                key={item.title}
                className="border-border-subtle bg-elevated rounded-xl border px-4 py-4"
              >
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  {item.title}
                </p>
                <p className="text-body text-foreground mt-2 font-medium">
                  {item.description}
                </p>
                <p className="text-body-sm text-text-secondary mt-1">
                  {item.meta}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reader shortcuts</CardTitle>
            <CardDescription>
              Static actions keep the module realistic without introducing any
              fetching or mutation logic yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button type="button" variant="secondary">
              Renew eligible titles
            </Button>
            <Button type="button" variant="outline">
              Review saved list
            </Button>
            <Button asChild variant="ghost">
              <Link href="/admin">Open admin workspace</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section
        id="profile"
        aria-labelledby="profile-title"
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]"
      >
        <Card>
          <CardHeader>
            <CardTitle id="profile-title">Profile</CardTitle>
            <CardDescription>
              This section holds the reader context that future borrowing flows
              can consume without changing the public shell.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {profileHighlights.map((item) => (
              <div
                key={item.label}
                className="border-border-subtle bg-card rounded-xl border px-4 py-4"
              >
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  {item.label}
                </p>
                <p className="text-body text-foreground mt-2 font-medium">
                  {item.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-secondary border-transparent">
          <CardHeader>
            <CardTitle>Experience notes</CardTitle>
            <CardDescription>
              Mobile-first spacing and tokenized surfaces match the same design
              system used in the reusable shells.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-body-sm text-text-secondary">
              The browse grid collapses to a single column first, then expands
              to two and three columns as space opens up.
            </p>
            <p className="text-body-sm text-text-secondary">
              Search, categories, borrowing context, and profile details now
              live in a dedicated module instead of inline route markup.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export { BookBrowseModule };
