import { signIn } from "@/auth";

export default function GithubSignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/" });
      }}
      className="p-2"
    >
      <button
        type="submit"
        className="p-3 bg-slate-800 text-slate-200 rounded-md"
      >
        Signin with GitHub
      </button>
    </form>
  );
}
