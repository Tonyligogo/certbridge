"use client";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/web/loadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/auth-client";

const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit({ email }: ForgotPasswordValues) {
    setError(null);
    setSuccess(null);

    const {error} = await requestPasswordReset({
        email,
        redirectTo: "/reset-password"
    });

    if (error) {
      setError(error.message || "Failed to send password reset link. Please try again later.");
    } else {
      setSuccess("Password reset link sent. Please check your email.");
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
            <FieldLabel htmlFor="email">Email</FieldLabel>

            <FieldContent>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...form.register("email")}
              />

              <FieldError errors={[form.formState.errors.email]} />
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
            size="lg"
          >
            Send reset link
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}