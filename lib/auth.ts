import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { sendEmail } from "./email";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { passwordSchema } from "./validation/password";
import { admin } from "better-auth/plugins";
import PasswordResetEmail from "@/app/features/emails/password-reset-email";
import EmailVerificationEmail from "@/app/features/emails/email-verification-email";
import EmailChangeConfirmationEmail from "@/app/features/emails/email-change-confirmation-email";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your CertBridge Global password",
        from: "support",
        react: PasswordResetEmail({
          userName: user.name,
          resetUrl: url,
        }),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email — CertBridge Global",
        from: "default",
        react: EmailVerificationEmail({
          userName: user.name,
          verificationUrl: url,
        }),
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Confirm your email address change — CertBridge Global",
          from: "support",
          react: EmailChangeConfirmationEmail({
            userName: user.name,
            currentEmail: user.email,
            newEmail,
            confirmationUrl: url,
          }),
        });
      },
    },
  },
  additionalFields: {
    role: {
      type: "string",
      input: false, //user cannot set their own role
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
          });
        }
      }
    }),
  },
  plugins: [admin()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user; //contains role field
