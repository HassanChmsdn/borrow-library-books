import {
  AdminProfileModule,
} from "@/modules/admin-profile";
import { getCurrentUser } from "@/lib/auth";
import { requireAdminSession } from "@/lib/auth/server";
import { createAdminProfileRecord } from "@/modules/admin-profile/server";

export default async function AdminProfilePage() {
  const session = await requireAdminSession("/admin/profile");
  const currentUser = getCurrentUser(session);
  const profile = currentUser ? await createAdminProfileRecord(currentUser) : undefined;

  return <AdminProfileModule profile={profile} />;
}