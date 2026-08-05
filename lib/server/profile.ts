import { getProfileByUserId } from "../db/profile";
import { getServerSession } from "../get-server-session";

export async function getCurrentProfile() {
  const session = await getServerSession();

  if (!session) {
    return null;
  }

  return getProfileByUserId(session.user.id);
}