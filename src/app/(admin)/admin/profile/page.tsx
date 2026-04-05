import {
  AdminProfileModule,
  createAdminProfileRecord,
} from "@/modules/admin-profile";
import { getCurrentUser } from "@/lib/auth";
import { requireMockAdminSession } from "@/lib/auth/server";

export default async function AdminProfilePage() {
  const session = await requireMockAdminSession("/admin/profile");
  const currentUser = getCurrentUser(session);

  return (
    <AdminProfileModule
      profile={currentUser ? createAdminProfileRecord(currentUser) : undefined}
    />
  );
}