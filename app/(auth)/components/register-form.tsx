"use client";

import { Button } from "@/components/ui/button";
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
import { signIn, signUp } from "@/lib/auth-client";
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
      callbackURL:"/auth/redirect"
    }); 
    if (res.error) {
      setError(res.error.message || "Registration failed. Please try again later."); 
    } else {
      router.push("/verify-email"); 
    }

  }

   async function handleSocialSignIn(provider: "google") {
      setError(null);
  
      const {error} = await signIn.social({
        provider,
        callbackURL: "/auth/redirect"
      });
      
      if (error) {
        setError(error.message || "Sign in failed. Please try again.");
      }
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
     <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full gap-2 cursor-pointer"
                disabled={loading}
                onClick={() => handleSocialSignIn("google")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
	<path d="M0 0h16v16H0z" fill="none" />
	<g fill="none" fillRule="evenodd" clipRule="evenodd">
		<path fill="#f44336" d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86" opacity=".987" />
		<path fill="#ffc107" d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92" opacity=".997" />
		<path fill="#448aff" d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49" opacity=".999" />
		<path fill="#43a047" d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z" opacity=".993" />
	</g>
</svg>

                Sign in with Google
              </Button>
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