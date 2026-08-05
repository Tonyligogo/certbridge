import { createAuthClient } from "better-auth/react";
import {inferAdditionalFields} from "better-auth/client/plugins"
import { auth } from "./auth";
import { adminClient } from "better-auth/client/plugins";

export const { signIn, signUp, signOut, useSession, sendVerificationEmail, requestPasswordReset, resetPassword, updateUser, changeEmail, changePassword, revokeSessions } = 
createAuthClient({
    plugins:[
        inferAdditionalFields<typeof auth>(),
        adminClient()
    ]
});