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

import { v4 as uuidv4 } from "uuid";

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
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  // create session for creds auth
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuidv4();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapterX?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  // persist session in cookies
  cookies: {
    sessionToken: {
      name: "authsession",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
  },

  // In session
});
