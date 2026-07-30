"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { passwordSchema } from "@/lib/validation";
import { LoadingButton } from "@/components/web/loadingButton";
import { changePassword } from "@/lib/auth-client";

const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }),
  newPassword: passwordSchema,
});

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export function PasswordForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  async function onSubmit({
    currentPassword,
    newPassword,
  }: UpdatePasswordValues) {
    setStatus(null);
    setError(null);
    
    const { error } = await changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions:true
    });
    if (error) {
      setError(error.message || "An error occurred while changing password");
    } else {
      setStatus("Password changed successfully.");
      form.reset();
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
          noValidate
        >
          {/* OAuth users (without a password) can use the "forgot password" flow */}

          <Field>
            <FieldLabel htmlFor="currentPassword">
              Current Password
            </FieldLabel>

            <FieldContent>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current password"
                  autoComplete="current-password"
                  {...form.register("currentPassword")}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                  onClick={() =>
                    setShowCurrentPassword((prev) => !prev)
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>

              <FieldError
                errors={[form.formState.errors.currentPassword]}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>

            <FieldContent>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New password"
                  autoComplete="new-password"
                  {...form.register("newPassword")}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                  onClick={() =>
                    setShowNewPassword((prev) => !prev)
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>

              <FieldError errors={[form.formState.errors.newPassword]} />
            </FieldContent>
          </Field>

          {error && (
            <div role="alert" className="text-sm text-red-600">
              {error}
            </div>
          )}

          {status && (
            <div role="status" className="text-sm text-green-600">
              {status}
            </div>
          )}

          <LoadingButton type="submit" loading={loading}>
            Change password
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}