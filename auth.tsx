import NextAuth from "next-auth";
import authConfig from "./auth.config";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "./app/lib/db";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { getUserFromDb } from "./app/actions/authActions";
import { signInSchema } from "./app/lib/zod";

import { encode as defaultEncode } from "next-auth/jwt";
import { Adapter } from "next-auth/adapters";

const adapterX: Adapter = PostgresAdapter(pool);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: adapterX,
  ...authConfig,
  providers: [
    GitHub,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user: any = null;

        const { email, password } = await signInSchema.parseAsync(credentials);

        // logic to verify if the user exists
        user = await getUserFromDb(email, password);

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.");
        }

        // return user object with their profile data
        console.log("🚀 ~ authorize: ~ user000000000000:", user);
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If the user is authenticated, add user data to the token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Attach the token data to the session
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  jwt: {
    encode: async function (params: any) {
      console.log("🚀 ~ params:", params);
      if (params.token) {
        const sessionToken = "1234567890";

        if (!params.token.sub) {
          throw new Error("No use Id found in token");
        }
        if (adapterX?.createSession) {
          const createdSession = await adapterX?.createSession({
            sessionToken: sessionToken,
            userId: params.token.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });

          if (!createdSession) {
            throw new Error("Failed to create session");
          }
        }

        return sessionToken;
      }

      // return (params.token);
      return defaultEncode(params.token);
    },
  },

  // In session
});
