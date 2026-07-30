'use client';

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
    const router = useRouter();
    const handleSignOut = async () => {
        const {error} = await signOut()
        if(!error){
            router.replace('/')
        }
    }
  return (
    <Button variant='ghost' onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer">
        <LogOut />
        <span className="inline-flex">Log Out</span>
    </Button>
  )
}

export default SignOutButton