import { redirect } from "next/navigation";

interface AdminAccessPageProps {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
}

export const metadata = {
  title: "Admin Access",
};

export default async function AdminAccessPage({ searchParams }: AdminAccessPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.redirectTo) {
    query.set("redirectTo", params.redirectTo);
  }

  redirect(query.size > 0 ? `/admin/auth?${query.toString()}` : "/admin/auth");
}