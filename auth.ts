
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import PostgresAdapter from "@auth/pg-adapter"
import { pool } from "./app/lib/db"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import { getUserFromDb } from "./app/actions/authActions"
import { signInSchema } from "./app/lib/zod"
import { saltAndHashPassword } from "./app/utils/password"


 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PostgresAdapter(pool),
  ...authConfig,
  providers:[
    GitHub,
        Credentials({
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          credentials: {
            email: {},
            password: {},
          },
          authorize: async (credentials) => {
            let user :any = null
     
            const { email, password } = await signInSchema.parseAsync(credentials)
    
            // logic to salt and hash password
            const pwHash: any = saltAndHashPassword(password)
     
            // logic to verify if the user exists
            user = await getUserFromDb(email, pwHash)
     
            if (!user) {
              // No user found, so this is their first attempt to login
              // Optionally, this is also the place you could do a user registration
              throw new Error("Invalid credentials.")
            }
     
            // return user object with their profile data
            return user
          },
        }),
      
  ]
})