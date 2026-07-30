import SignOutButton from "@/app/(auth)/components/signOutButton"
import { User } from "@/lib/auth";
import { getServerSession } from "@/lib/get-server-session"
import { redirect } from "next/navigation";

interface ClientInformationProps{
  user:User
}

const ClientPortal = async() => {
  const session = await getServerSession()
  const user = session?.user;

  if(!user) {
    redirect('/')
  }

  console.log(user)
  return (
    <div>ClientPortal
      <SignOutButton/>
    </div>
  )
}

export default ClientPortal