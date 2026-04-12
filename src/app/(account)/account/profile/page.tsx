import {
  ProfileEmptyState,
  ProfileModule,
} from "@/modules/profile";
import { getCurrentUserSession } from "@/lib/auth/server";
import { getProfileDataForUser } from "@/modules/profile/server";

export const metadata = {
  title: "Profile",
};

export default async function AccountProfilePage() {
  const currentUser = await getCurrentUserSession();
  const profile = currentUser ? await getProfileDataForUser(currentUser.id) : null;

  if (!profile) {
    return <ProfileEmptyState />;
  }

  return <ProfileModule profile={profile} />;
}