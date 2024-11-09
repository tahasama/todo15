"use server";

import { query } from "../lib/db";
import { revalidatePath } from "next/cache";
import credentials from "next-auth/providers/credentials";
import { signInSchema, signupSchema } from "../lib/zod";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { saltAndHashPassword } from "../utils/password";
import { signIn } from "@/auth";

export const getUserFromDb = async (email: string, password: string) => {
  // Query the database for the user by email
  const res = await query("SELECT * FROM users WHERE email = $1", [email]);

  if (res.rows.length === 0) {
    return null; // User not found
  }

  const user = res.rows[0];

  // Split the stored salt and hash
  const [storedSalt, storedHash] = user.passwordhash.split(":");

  // Hash the provided password using the stored salt
  const hash = crypto
    .pbkdf2Sync(password, storedSalt, 1000, 64, "sha512")
    .toString("hex");

  // Compare the hashed password with the stored hash
  if (hash === storedHash) {
    console.log("🚀 ~ getUserFromDb ~ user:", user);
    return user; // Password matches, return user object
  } else {
    return null; // Password does not match
  }
};

export const addUser = async (
  prevState: { message: string } | undefined,
  formData: FormData
) => {
  const data = Object.fromEntries(formData);
  const { email, password, name } = await signupSchema.parseAsync(data);

  // Check if email is already in use
  const existingUser = await query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (existingUser.rows.length > 0) {
    return { message: "Email is already in use" };
  }

  if (!email) {
    return { message: "Please add email" };
  }

  if (!password) {
    return { message: "Please add password" };
  }
  if (!name) {
    return { message: "Please add name" };
  }

  if (name && email && password) {
    // Generate and store the hashed password and salt
    const pwHash = saltAndHashPassword(password);

    // Insert the new user into the database
    const res = await query(
      "INSERT INTO users (email, passwordhash, name) VALUES ($1, $2, $3) RETURNING *",
      [email, pwHash, name]
    );

    if (res.rowCount === 0) {
      return {
        message: "Failed to add user, please refresh or try again later",
      };
    }

    redirect("/"); // Redirect to home page
    return { message: "" }; // Success
  }

  return { message: "Please fill all fields" };
};

export const login = async (prevState: any, formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email) {
    return { err: "Please add email" };
  }

  if (!password) {
    return { err: "Please add password" };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    return { err: "wrong email or password, please try again!" };
  }
};
