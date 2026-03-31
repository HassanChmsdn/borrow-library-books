import Link from "next/link";

import { PageHeader } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Public Shell Preview",
};

const publicShellHighlights = [
  {
    title: "Top navigation",
    description:
      "Stacks vertically on smaller screens, keeps utility actions within reach, and settles into a single-row bar as space opens up.",
  },
  {
    title: "Responsive container",
    description:
      "Uses tokenized gutters and max-width constraints so the layout proportions stay aligned with the design system instead of page-specific overrides.",
  },
  {
    title: "Header pattern",
    description:
      "Pairs the display typography scale with a flexible action row and optional supporting content block.",
  },
];

const publicShellBehaviors = [
  "Spacing steps increase from the base mobile rhythm instead of hard-coding desktop values.",
  "Surface, border, and text tokens stay semantic so components can be reused without recoloring them per page.",
  "Preview content is intentionally static so the route demonstrates layout only, not feature behavior.",
];

export default function PublicShellPreviewPage() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Public Shell"
        title="Reader-facing layout preview"
        description="This root route now exercises the reusable public shell with token-driven spacing, navigation, and a page header pattern. The content is intentionally static and exists only to preview layout behavior."
        actions={
          <>
            <Button asChild size="sm" variant="outline">
              <Link href="/#responsive-behavior">Responsive Notes</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin">Open Admin Preview</Link>
            </Button>
          </>
        }
      >
        <div
          id="token-note"
          className="rounded-card border-border-subtle bg-card grid gap-4 border p-4 shadow-xs sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-center"
        >
          <div className="space-y-2">
            <p className="text-label text-text-tertiary font-medium tracking-[0.18em] uppercase">
              Preview Surface
            </p>
            <p className="text-body text-text-secondary max-w-2xl text-pretty">
              This utility row previews how search and action controls sit
              inside the public shell without introducing any live filtering or
              browsing logic yet.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              aria-label="Preview search field"
              placeholder="Search field preview"
            />
            <Button type="button" variant="secondary">
              Surface Action
            </Button>
          </div>
        </div>
      </PageHeader>

      <section
        id="layout-regions"
        aria-labelledby="public-layout-regions-title"
        className="grid gap-4 md:grid-cols-3"
      >
        {publicShellHighlights.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section
        id="responsive-behavior"
        aria-labelledby="responsive-behavior-title"
        className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]"
      >
        <Card>
          <CardHeader>
            <CardTitle id="responsive-behavior-title">
              Mobile-first shell behavior
            </CardTitle>
            <CardDescription>
              The layout primitives are mounted through App Router layouts, so
              every future public page inherits the same shell without
              reassembling navigation or container structure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-body-sm text-text-secondary space-y-3">
              {publicShellBehaviors.map((behavior) => (
                <li
                  key={behavior}
                  className="border-border-subtle border-b pb-3 last:border-b-0 last:pb-0"
                >
                  {behavior}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next step surfaces</CardTitle>
            <CardDescription>
              These routes are intentionally non-business previews. Future page
              modules can drop into the shell once real product flows exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-secondary rounded-xl px-4 py-3">
              <p className="text-label text-primary font-medium tracking-[0.18em] uppercase">
                Route group
              </p>
              <p className="text-body-sm text-text-secondary mt-1">
                Public routes now live under a dedicated route group layout.
              </p>
            </div>
            <div className="bg-muted rounded-xl px-4 py-3">
              <p className="text-label text-foreground font-medium tracking-[0.18em] uppercase">
                Preview only
              </p>
              <p className="text-body-sm text-text-secondary mt-1">
                Replace this content with real modules later without changing
                the shell scaffolding.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
