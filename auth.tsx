import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import { pool, query } from "./lib/db";
import { signInSchema } from "./lib/zod";
// import { Adapter } from "next-auth/adapters";
// import PostgresAdapter from "@auth/pg-adapter";
import authConfig from "./auth.config";
import GitHub from "next-auth/providers/github";
import { getUserFromDb } from "./app/actions/authActions";
import { query } from "./lib/db";

// const adapterX: Adapter = PostgresAdapter(pool);

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: adapterX,
  ...authConfig,
  // callbacks: {
  //   jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     session.user.id = token.id as string;
  //     // Check if the user exists
  //     const existingUser = await query("SELECT * FROM users WHERE email = $1", [
  //       session.user.email,
  //     ]);

  //     // Add user to database if not exists
  //     if (existingUser.rows.length === 0) {
  //       await query("INSERT INTO users (email, psswrdhash) VALUES ($1, $2)", [
  //         session.user.email,
  //         "",
  //       ]);
  //     }
  //     return session;
  //   },
  // },
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        psswrd: {},
      },
      async authorize(credentials: any) {
        const { email, psswrd } = await signInSchema.parseAsync(credentials);
        const user = await getUserFromDb(email, psswrd);
        console.log("🚀 ~ authorize ~ user:", user);
        if (user === null) {
          return {
            error: true,
            message: "Incorrect email or psswrd",
          };
        }
        return user;
      },
    }),
  ],
});
