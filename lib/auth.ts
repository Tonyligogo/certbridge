import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { sendEmail } from "./email";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { passwordSchema } from "./validation";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders:{
    google:{
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  },
  emailAndPassword:{
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async({user,url}) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`
      })
    }
  },
  emailVerification:{
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async({user,url}) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Click the link to verify your email: ${url}`
      })
    }
  },
  user:{
    changeEmail:{
      enabled:true,
      sendChangeEmailConfirmation: async ({user, newEmail, url})=>{
        void sendEmail({
          to:user.email,
          subject:"Confirm your email change",
          text:`Your email has been changed to ${newEmail}. Click the link to approve the change: ${url}`
        })
        }
      }
    },
    additionalFields:{
      role:{
        type: "string",
        input:false, //user cannot set their own role
      }
    },
  hooks:{
    before: createAuthMiddleware(async ctx => {
      if(ctx.path === "/sign-up/email" || ctx.path === "/reset-password" || ctx.path === "/change-password"){
        const password = ctx.body.password || ctx.body.newPassword;
        const {error} = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST",{
            message:"Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
          })
        }
      }
    })
  }
});

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user; //contains role field