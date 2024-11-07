import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserFromDb } from "./app/actions/authActions"
import { signInSchema } from "./app/lib/zod"
import { saltAndHashPassword } from "./app/utils/password"
 
// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [],
} satisfies NextAuthConfig