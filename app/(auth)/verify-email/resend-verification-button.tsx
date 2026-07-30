'use client';
import { sendVerificationEmail } from "@/lib/auth-client";
import { useState } from "react";

const ResendVerificationButton = ({email}: {email: string}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleResendVerification = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        const {error} = await sendVerificationEmail({
            email,
            callbackURL: "/email-verified"
        });
        
        setIsLoading(false);
        if (error) {
            setError(error.message || "Failed to resend verification email. Please try again later.");
        } else {
            setSuccess(true);
        }
    }
  return (
    <div>
        {success && (
            <p className="text-green-600">Verification email sent successfully!</p>
        )}
        {error && (
            <p className="text-red-600">{error}</p>
        )}
        <button
            onClick={handleResendVerification}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
            {isLoading ? 'Resending...' : 'Resend Verification Email'}
        </button>
    </div>
  )
}

export default ResendVerificationButton