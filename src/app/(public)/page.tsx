import { BookBrowseModule } from "@/modules/catalog";

export const metadata = {
  title: "Browse Books",
};

export default function PublicShellPreviewPage() {
  return <BookBrowseModule />;
}
