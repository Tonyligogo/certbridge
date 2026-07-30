import { Metadata } from "next"
import { SignInForm } from "../components/login-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to access our training courses and services.',
}

const LoginPage = () => {
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
      <div className="w-lg">
        <SignInForm />
      </div>
    </div>
  )
}

export default LoginPage