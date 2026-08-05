"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/web/loadingButton";
import { changeEmail } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const updateEmailSchema = z.object({
  newEmail: z.email({ message: "Enter a valid email" }),
});

export type UpdateEmailValues = z.infer<typeof updateEmailSchema>;

interface EmailFormProps {
  currentEmail: string;
}

export function EmailForm({ currentEmail }: EmailFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateEmailValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      newEmail: currentEmail,
    },
  });

  async function onSubmit({newEmail}: UpdateEmailValues) {
    setError(null);
    setStatus(null);
    const { error } = await changeEmail({newEmail, callbackURL:"/email-verified"});
    if (error) {
      setError(error.message || "An error occurred while changing email");
    } else {
      setStatus("Email change requested successfully. Please check your inbox for confirmation.");
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
          noValidate
        >
          <Field>
            <FieldLabel htmlFor="newEmail">New Email</FieldLabel>

            <FieldContent>
              <Input
                id="newEmail"
                type="email"
                placeholder="new@email.com"
                {...form.register("newEmail")}
              />

              <FieldError errors={[form.formState.errors.newEmail]} />
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
            Request change
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}