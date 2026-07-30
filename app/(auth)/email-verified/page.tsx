import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email Verified",
};

export default function EmailVerifiedPage() {
  return (
    <div className="h-screen w-screen relative grid place-content-center text-center">
      <Link href="/" className="absolute top-4 left-4 md:top-6 md:left-6">
        <div className="flex items-center gap-3 group cursor-pointer">
          {/* Corporate Logo Icon */}
          <div className="relative w-8 h-8 flex items-center justify-center bg-slate-950 rounded-full text-white font-black overflow-hidden tracking-tighter">
            <span className="text-xs z-10">C</span>
            <span className="text-xs z-10 -ml-0.5 text-blue-400">B</span>
            <div className="absolute inset-0 bg-linear-to-tr from-slate-900 via-transparent to-slate-800 opacity-50" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            CertBridge
            <span className="text-slate-500 font-medium text-lg ml-1">
              Global
            </span>
          </span>
        </div>
      </Link>
      <h1 className="text-2xl font-bold">Your Email Has Been Verified</h1>
      <p className="mt-2 text-gray-600 max-w-2xl mb-8">
        Your email has been successfully verified. You can now proceed to your dashboard.
      </p>
      <Button asChild size="lg" className="w-fit mx-auto">
          <Link href="/portal">Go to dashboard</Link>
        </Button>
    </div>
  );
}