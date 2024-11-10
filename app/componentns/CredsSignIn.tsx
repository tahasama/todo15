// "use client";
import { auth, signIn } from "@/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "../actions/authActions";
import { useActionState, useState } from "react";
// import { useActionState } from "react";
// import { login } from "../actions/authActions";

export function CredsSignIn() {
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = async (e: any) => {
    e.preventDefault(); // Prevent form's default behavior
    console.log("🚀 ~ onSubmit ~ formData:", e.target.email.value);
    await signIn(e.target.email.value, e.target.password.value);
    // const result = await login(e.target.email.value, e.target.password.value)
    console.log("🚀 ~ onSubmit ~ result:", result);
    // if (result?.status === "success") {
    //   router.push("/members");
    //   router.refresh();
    // } else {
    //   setError(result?.error as string);
    //   console.error(result?.error);
  };

  return (
    <>
      <form
        // action={async (formData) => {
        //   "use server";
        //   await signIn("credentials", formData);
        // }}
        onSubmit={onSubmit}
        className="p-2"
      >
        <input type="hidden" name="redirectTo" value="/" />

        <label className="mx-2">
          Email
          <input name="email" type="email" className="rounded-b-md p-1 m-1" />
        </label>
        <label className="mx-2">
          Password
          <input
            name="password"
            type="password"
            className="rounded-b-md p-1 m-1"
          />
        </label>
        <button className="bg-white text-blue-600 rounded-md py-1 px-2">
          Sign In
        </button>
      </form>
      <h2 className="text-md font-light text-red-500 text-center pt-2">
        {error}
      </h2>
    </>
  );
}
