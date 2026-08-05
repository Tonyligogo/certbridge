import { getServerSession } from "@/lib/get-server-session";
import { redirect } from "next/navigation";

const Page = async() => {
    const session = await getServerSession()
      const user = session?.user;
      if(!user) {
        redirect('/sign-in')
      }
      if(user){
        redirect(`/portal/${user.id}`)
      }
}

export default Page