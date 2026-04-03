import {
  getProfileData,
  ProfileEmptyState,
  ProfileModule,
} from "@/modules/profile";

export const metadata = {
  title: "Profile",
};

export default function AccountProfilePage() {
  const profile = getProfileData();

  if (!profile) {
    return <ProfileEmptyState />;
  }

  return <ProfileModule profile={profile} />;
}