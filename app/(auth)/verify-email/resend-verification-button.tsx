"use client";

import { sendVerificationEmail } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RESEND_COOLDOWN_SECONDS = 60;

const ResendVerificationButton = ({
  email,
}: {
  email: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleResendVerification = async () => {
    // Prevent requests while loading or cooling down
    if (isLoading || cooldown > 0) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } =
        await sendVerificationEmail({
          email,
          callbackURL: "/email-verified",
        });

      if (error) {
        if (
          error.code ===
          "EMAIL_ALREADY_VERIFIED"
        ) {
          router.replace("/portal");
          return;
        }

        setError(
          error.message ||
            "Failed to resend verification email. Please try again later."
        );

        setCooldown(RESEND_COOLDOWN_SECONDS);

        return;
      }

      setSuccess(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      console.error(
        "Failed to resend verification email:",
        error
      );

      setError(
        "Failed to resend verification email. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || cooldown > 0;

  return (
    <div className="space-y-3">
      {success && (
        <p className="text-sm text-green-600">
          Verification email sent successfully!
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleResendVerification}
        disabled={disabled}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading
          ? "Resending..."
          : cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Resend Verification Email"}
      </button>
    </div>
  );
};

export default ResendVerificationButton;