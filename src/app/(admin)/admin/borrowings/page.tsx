import { AdminBorrowingsModule } from "@/modules/admin-borrowings";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import { getI18n } from "@/lib/i18n/server";
import { listAdminBorrowingRecords } from "@/modules/admin-borrowings/server";

export const metadata = {
  title: "Admin Borrowings",
};

export default async function AdminBorrowingsPage() {
  await requireAuthorizedRoute("/admin/borrowings");
  const [{ translateText }, records] = await Promise.all([
    getI18n(),
    listAdminBorrowingRecords(),
  ]);

  return (
    <AdminBorrowingsModule
      records={records}
      headerCopy={{
        description: translateText(
          "Review pending approvals, active loans, overdue follow-up, returned records, and rejected request history in a dense but readable circulation workspace.",
        ),
        eyebrow: translateText("Circulation"),
        title: translateText("Borrowing operations"),
      }}
    />
  );
}
