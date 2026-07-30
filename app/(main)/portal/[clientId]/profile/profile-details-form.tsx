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
import { User } from "@/lib/auth";
import { updateUser } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  image: z.string().optional().nullable(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

interface ProfileDetailsFormProps {
    user: User;
}

export function ProfileDetailsForm({ user }: ProfileDetailsFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? ""
    },
  });

  async function onSubmit({ name }: UpdateProfileValues) {
    setError(null);
    setStatus(null);
    const {error} = await updateUser({name})
    if(error){
        setError(error.message || "An error occurred while updating profile");
    }
    else{
        setStatus("Profile updated successfully");
        router.refresh();
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
          noValidate
        >
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>

            <FieldContent>
              <Input
                id="name"
                placeholder="Full name"
                {...form.register("name")}
              />

              <FieldError errors={[form.formState.errors.name]} />
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

          <LoadingButton size='lg' type="submit" loading={loading}>
            Save changes
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}