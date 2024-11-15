"use server";

import { signIn } from "@/auth";
import { formSchema } from "@/lib/zod";
import { z } from "zod";
import crypto from "crypto";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import { saltAndHashPassword } from "../utils/password";
// "use server";

// import { query } from "@/lib/db";
// import { redirect } from "next/navigation";
// import { saltAndHashpsswrd } from "@/lib/utils";
// import { formSchema, signInSchema } from "@/lib/zod";
// import crypto from "crypto";

// // Function to salt and hash psswrd

export const addUser = async ({
  email,
  psswrd,
  confirmPsswrd,
}: {
  email: string;
  psswrd: string;
  confirmPsswrd: string;
}) => {
  // Server-side validation using zod
  const parseResult = await formSchema.safeParseAsync({
    email,
    psswrd,
    confirmPsswrd,
  });

  if (!parseResult.success) {
    // return { error: "Validation failed. Please check your inputs." };
    return { error: true, message: parseResult.error.issues[0].message };
  }

  // Validate the email uniqueness first

  const existingUser = await query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (existingUser.rows.length > 0) {
    return { error: true, message: "This email is already registered." };
  }

  // Generate the psswrd hash
  const pwHash = saltAndHashPassword(psswrd);

  // Insert the new user into the database

  const result = await query(
    "INSERT INTO users (email, psswrdhash) VALUES ($1, $2) RETURNING *",
    [email, pwHash]
  );

  if (result.rowCount === 0) {
    return {
      error: true,
      message: "Failed to add user. Please try again later.",
    };
  }
  redirect("/"); // Redirect to home page on success
  return { success: true };
};

export const loginWithGitHub = async () => {
  console.log("🚀 ~ loginWithGitHub ~ async:");
  const ccc = await signIn("github");
  console.log("🚀 ~ loginWithGitHub ~ ccc:", ccc);

  // const existingUser = await query("SELECT * FROM users WHERE email = $1", [
  //   email,
  // ]);
  // if (existingUser.rows.length > 0) {
  //   return { error: true, message: "This email is already registered." };
  // }
};

export async function getUsers() {
  const result = await query("SELECT *FROM users");

  if (!result) {
    return {
      message: "Failed to fetch users",
      users: [],
    };
  }

  return {
    users: result.rows,
    message: "",
  };
}

// export const getUserFromDb = async (email: string, psswrd: string) => {
//   // Query the database for the user by email

//   const parseResult = await signInSchema.safeParseAsync({
//     email,
//     psswrd,
//   });

//   if (!parseResult.success) {
//     // return { error: "Validation failed. Please check your inputs." };
//     return { error: true, message: parseResult.error.issues[0].message };
//   }
//   const res = await query("SELECT * FROM users WHERE email = $1", [email]);

//   if (res.rows.length === 0) {
//     return {
//       error: true,
//       message: "User not found",
//     }; // User not found
//   }

//   const user = res.rows[0];

//   // Split the stored salt and hash
//   const [storedSalt, storedHash] = user.psswrdhash.split(":");

//   // Hash the provided psswrd using the stored salt
//   const hash = crypto
//     .pbkdf2Sync(psswrd, storedSalt, 1000, 64, "sha512")
//     .toString("hex");

//   // Compare the hashed psswrd with the stored hash
//   if (hash === storedHash) {
//     console.log("🚀 ~ getUserFromDb ~ user:", user);
//     return { error: false, message: "", user }; // psswrd matches, return user object
//   } else {
//     return {
//       error: true,
//       message: "wrong psswrd",
//     }; // psswrd does not match
//   }
// };

// // export const credsLogin = async ({
// //   email,
// //   psswrd,
// // }: {
// //   email: string;
// //   psswrd: string;
// // }) => {
// //   const parseResult = await signInSchema.safeParseAsync({
// //     email,
// //     psswrd,
// //   });

// //   if (!parseResult.success) {
// //     // return { error: "Validation failed. Please check your inputs." };
// //     return { error: true, message: parseResult.error.issues[0].message };
// //   }

// // };

export const loginWithCredentials = async ({
  email,
  psswrd,
}: {
  email: string;
  psswrd: string;
}) => {
  const loginSchema = z.object({
    email: z.string().email(),
    psswrd: z.string().min(5, "psswrd must contain at least 5 characters"),
  });

  const loginValidation = loginSchema.safeParse({
    email,
    psswrd,
  });

  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  // try {
  const xxx = await signIn("credentials", {
    email,
    psswrd,
    redirect: false,
  });
  // } catch (error) {
  //   return {
  //     error: true,
  //     message: "Incorrect email or psswrd",
  //   };
  // }
};

export const getUserFromDb = async (email: string, psswrd: string) => {
  // Query the database for the user by email
  const res = await query("SELECT * FROM users WHERE email = $1", [email]);

  if (res.rows.length === 0) {
    return null; // User not found
  }

  const user = res.rows[0];
  console.log("🚀 ~ getUserFromDb ~ user:", user);

  // Split the stored salt and hash
  const [storedSalt, storedHash] = user.psswrdhash.split(":");

  // Hash the provided psswrd using the stored salt
  const hash = crypto
    .pbkdf2Sync(psswrd, storedSalt, 1000, 64, "sha512")
    .toString("hex");

  // Compare the hashed psswrd with the stored hash
  if (hash === storedHash) {
    console.log("🚀 ~ getUserFromDb ~ user:", user);
    return user; // psswrd matches, return user object
  } else {
    return null; // psswrd does not match
  }
};
