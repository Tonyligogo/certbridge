import { getCurrentProfile } from "@/lib/server/profile";
import CompleteProfileBanner from "./components/complete-profile-banner"

const Dashboard = async() => {
  const profile = await getCurrentProfile();

  return (
    <div>
        {profile && !profile.onboardingComplete && <CompleteProfileBanner/>}
    </div>
  )
}

export default Dashboard