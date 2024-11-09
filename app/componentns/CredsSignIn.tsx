// "use client";
import { signIn } from "@/auth";
// import { useActionState } from "react";
// import { login } from "../actions/authActions";

export function CredsSignIn() {
  // const [state, action, pending] = useActionState(login, "");
  // console.log("🚀 ~ CredsSignIn ~ state:", state);
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("credentials", formData);
      }}
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
  );
}
