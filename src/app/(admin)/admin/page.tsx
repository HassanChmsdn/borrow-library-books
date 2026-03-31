import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Admin Shell Preview",
};

const adminShellRegions = [
  {
    title: "Drawer and sidebar",
    description:
      "One navigation definition feeds both the mobile drawer and the desktop sidebar so the information architecture stays aligned across breakpoints.",
  },
  {
    title: "Sticky top header",
    description:
      "The header remains visible while content scrolls, which keeps shell actions and context in view on larger datasets later.",
  },
  {
    title: "Content wrapper",
    description:
      "Main content stays inside a tokenized max-width wrapper, preventing the admin canvas from stretching into unreadable proportions.",
  },
];

const adminCanvasNotes = [
  "The route-group layout now owns the admin shell, so future admin screens inherit the frame automatically.",
  "Preview sections use static cards only, keeping this route free of domain logic while still showing the layout rhythm.",
  "Action surfaces, content regions, and navigation landmarks already expose anchors for quick visual review.",
];

export default function AdminShellPreviewPage() {
  return (
    <div className="gap-section flex flex-col">
      <section
        id="navigation"
        aria-labelledby="admin-navigation-title"
        className="grid gap-4 lg:grid-cols-3"
      >
        {adminShellRegions.map((region) => (
          <Card key={region.title}>
            <CardHeader>
              <CardTitle>{region.title}</CardTitle>
              <CardDescription>{region.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section
        id="content-canvas"
        aria-labelledby="admin-content-canvas-title"
        className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]"
      >
        <Card>
          <CardHeader>
            <CardTitle id="admin-content-canvas-title">
              Admin content canvas preview
            </CardTitle>
            <CardDescription>
              This area represents where future admin modules can render tables,
              forms, and dashboards while inheriting the shell spacing and
              wrapper behavior.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="border-border-subtle bg-elevated rounded-xl border border-dashed px-4 py-4">
              <p className="text-label text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Primary Panel
              </p>
              <p className="text-body-sm text-text-secondary mt-2">
                Use this region for high-signal operational content.
              </p>
            </div>
            <div className="border-border-subtle bg-elevated rounded-xl border border-dashed px-4 py-4">
              <p className="text-label text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Secondary Panel
              </p>
              <p className="text-body-sm text-text-secondary mt-2">
                Use this region for supporting context, filters, or summaries.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Implementation notes</CardTitle>
            <CardDescription>
              The preview route keeps the shell reusable while exposing the key
              regions that future admin pages will occupy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-body-sm text-text-secondary space-y-3">
              {adminCanvasNotes.map((note) => (
                <li
                  key={note}
                  className="border-border-subtle border-b pb-3 last:border-b-0 last:pb-0"
                >
                  {note}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
