"use client";

import { useActionState } from "react";
import { addUser } from "../actions/authActions";

export function CredsSignUp() {
  const [state, handleSignUp, ispending] = useActionState(addUser, {
    message: "",
  });

  return (
    <form className="p-2" action={handleSignUp}>
      <label className="mx-2">
        Email
        <input
          name="email"
          type="email"
          className="rounded-b-md p-1 m-1 text-slate-900"
          required
        />
      </label>
      <label className="mx-2">
        Name
        <input
          name="name"
          type="text"
          className="rounded-b-md p-1 m-1 text-slate-900"
          required
        />
      </label>
      <label className="mx-2">
        Password
        <input
          name="password"
          type="password"
          className="rounded-b-md p-1 m-1 text-slate-900"
          required
        />
      </label>
      <button className="bg-white text-blue-600 rounded-md py-1 px-2">
        Sign Up
      </button>

      {state.message && <p className="text-red-500 mt-2">{state.message}</p>}
    </form>
  );
}
