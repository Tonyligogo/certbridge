"use client";

import { LoadingButton } from "@/components/web/loadingButton";
import { revokeSessions } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutEverywhereButton() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogoutEverywhere() {
    setLoading(true);
    const {error} = await revokeSessions();
    setLoading(false);
    if (error) {
      alert("Failed to log out everywhere");
    } else {
      router.replace("/");
    }
  }

  return (
    <LoadingButton
      variant="destructive"
      onClick={handleLogoutEverywhere}
      loading={loading}
      className="w-full"
    >
      Log out everywhere
    </LoadingButton>
  );
}