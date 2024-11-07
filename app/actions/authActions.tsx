"use server";

import { query } from "../lib/db";
import { revalidatePath } from "next/cache";
import credentials from "next-auth/providers/credentials";
import { signInSchema, signupSchema } from "../lib/zod";
import { saltAndHashPassword } from "../utils/password";
import { redirect } from "next/navigation";

export const getUserFromDb = async (email: string, pwHash: string) => {
  try {
    // Query the database for the user
    const res = await query("SELECT * FROM users WHERE email = $1", [email]);

    if (res.rows.length === 0) {
      return null; // User not found
    }

    const user = res.rows[0];

    // Separate the stored hash into salt and hash
    const [storedSalt, storedHash] = pwHash.split(":");

    // Compare the hashed password with the stored hash
    if (storedSalt === storedHash) {
      return user; // Password matches, return the user
    } else {
      return null; // Password does not match
    }
  } catch (error) {
    console.error("Error fetching user from database:", error);
    throw new Error("Database query failed");
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
  if (name && email && password) {
    // // logic to salt and hash password
    const pwHash: any = saltAndHashPassword(password);
    // Insert the new user
    const res = await query(
      "INSERT INTO users (email, passwordhash, name) VALUES ($1, $2, $3) RETURNING *",
      [email, pwHash, name]
    );

    if (res.rowCount === 0) {
      return {
        message: "failed to add you user please refresh or try again later",
      };
    }
    redirect("/");
    // return { message: "task added successfully!" };
    return { message: "" };
  }
  return { message: "please fill all fields" };
};

// Extract and validate form data
