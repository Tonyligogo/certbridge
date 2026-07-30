import { createClient } from "@/lib/supabase/server"

const Page = async () => {
    const supabase = await createClient();
   await supabase.auth.signInWithOtp({
    email: 'ligogo.dev@gmail.com',
    
  })

  return (
    <div className="flex justify-center items-center">
        <p>Check your email for the login link.</p>
    </div>
  )
}

export default Page