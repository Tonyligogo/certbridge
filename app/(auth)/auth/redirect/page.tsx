import { getServerSession } from "@/lib/get-server-session";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "admin") {
    redirect("/admin");
  }

  redirect("/portal");
}