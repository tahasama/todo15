import { loginWithGitHub } from "@/app/actions/authActions";
import { signIn } from "@/auth";

export default function GithubSignIn() {
  return (
    <form action={loginWithGitHub} className="p-2">
      <button
        type="submit"
        className="p-3 bg-slate-800 text-slate-200 rounded-md"
      >
        Signin with GitHub
      </button>
    </form>
  );
}
