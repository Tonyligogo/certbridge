"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/web/loadingButton";
import { passwordSchema } from "@/lib/validation";
import { resetPassword } from "@/lib/auth-client";

const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit({ newPassword }: ResetPasswordValues) {
    setError(null);
    setSuccess(null);

    const {error} = await resetPassword({
        newPassword,
        token
    });
    if (error) {
      setError(error.message || "Failed to reset password. Please try again later.");
    } else {
      setSuccess("Password reset successfully.");
      setTimeout(()=> router.replace("/sign-in"), 2000); // Redirect to sign-in page after 2 seconds
    }
    form.reset();
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Field>
            <FieldLabel htmlFor="newPassword">New password</FieldLabel>

            <FieldContent>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  {...form.register("newPassword")}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>

              <FieldError errors={[form.formState.errors.newPassword]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">
              Confirm password
            </FieldLabel>

            <FieldContent>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  {...form.register("confirmPassword")}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>

              <FieldError errors={[form.formState.errors.confirmPassword]} />
            </FieldContent>
          </Field>

          {success && (
            <div role="status" className="text-sm text-green-600">
              {success}
            </div>
          )}

          {error && (
            <div role="alert" className="text-sm text-red-600">
              {error}
            </div>
          )}

          <LoadingButton
            type="submit"
            className="w-full"
            loading={loading}
            size='lg'
          >
            Reset password
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}