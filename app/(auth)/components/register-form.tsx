"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LabelInputGroup } from "@/components/web/labelInputGroup";
import { LoadingButton } from "@/components/web/loadingButton";
import { PasswordInput } from "@/components/web/password-input";
import { signUp } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validation/password";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Please enter a valid email" }),
    password: passwordSchema,
    passwordConfirmation: z
      .string()
      .min(1, { message: "Please confirm password" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit({ email, password, name }: SignUpValues) {
    setError(null)
    const res = await signUp.email({
      email,
      password,
      name,
      callbackURL:"/email-verfified"
    }); 
    if (res.error) {
      setError(res.error.message || "Registration failed. Please try again later."); 
    } else {
      router.push("/portal"); 
    }

    console.log(email, password, 'sign-up')
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <LabelInputGroup>
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        type="text"
        placeholder="Your Name"
        {...form.register("name")}
      />
      {form.formState.errors.name && (
        <p className="text-sm text-red-600">
          {form.formState.errors.name.message}
        </p>
      )}
    </LabelInputGroup>
    <LabelInputGroup>
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="your@email.com"
        {...form.register("email")}
      />
      {form.formState.errors.email && (
        <p className="text-sm text-red-600">
          {form.formState.errors.email.message}
        </p>
      )}
    </LabelInputGroup>

    <LabelInputGroup>
      <Label htmlFor="password">Password</Label>
      <PasswordInput
        id="password"
        autoComplete="new-password"
        placeholder="Password"
        {...form.register("password")}
      />
      {form.formState.errors.password && (
        <p className="text-sm text-red-600">
          {form.formState.errors.password.message}
        </p>
      )}
    </LabelInputGroup>

    <LabelInputGroup>
      <Label htmlFor="passwordConfirmation">
        Confirm Password
      </Label>
      <PasswordInput
        id="passwordConfirmation"
        autoComplete="new-password"
        placeholder="Confirm password"
        {...form.register("passwordConfirmation")}
      />
      {form.formState.errors.passwordConfirmation && (
        <p className="text-sm text-red-600">
          {form.formState.errors.passwordConfirmation.message}
        </p>
      )}
    </LabelInputGroup>

    {error && (
      <div role="alert" className="text-sm text-red-600">
        {error}
      </div>
    )}

    <LoadingButton
      type="submit"
      className="w-full"
      loading={loading}
    >
      Create an account
    </LoadingButton>
        <div className="flex w-full justify-center">
          <p className="text-muted-foreground text-center text-xs">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>
          </p>
        </div>
  </form>
</CardContent>
    </Card>
  );
}