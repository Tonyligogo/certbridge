import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reset password",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      {token ? (
        <ResetPasswordUI token={token} />
      ) : (
        <div role="alert" className="text-red-600">
          Token is missing.
        </div>
      )}
    </main>
  );
}

interface ResetPasswordUIProps {
  token: string;
}

function ResetPasswordUI({ token }: ResetPasswordUIProps) {
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
      <div className="w-xl">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mb-8">
            Enter your new password below
        </p>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}