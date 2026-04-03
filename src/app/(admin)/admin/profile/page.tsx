import {
  AdminProfileModule,
  createAdminProfileRecord,
} from "@/modules/admin-profile";
import { requireMockAdminSession } from "@/server/auth/mock-session";

export default async function AdminProfilePage() {
  const session = await requireMockAdminSession("/admin/profile");

  return (
    <AdminProfileModule
      profile={
        session.currentUser ? createAdminProfileRecord(session.currentUser) : undefined
      }
    />
  );
}