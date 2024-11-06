import { signOut } from "@/auth";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        type="submit"
        className="px-3 py-1.5 bg-slate-100 ring-1 ring-red-500 text-red-500 rounded-md"
      >
        Sign Out
      </button>
    </form>
  );
}
