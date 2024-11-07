import { signIn } from "@/auth";

export function CredsSignIn() {
  return (
    <form
      action={async (formData) => {
        "use server";
        const ccc = await signIn("credentials", formData);
        console.log("🚀 ~ action={ ~ cccxy:");
      }}
      className="p-2"
    >
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
