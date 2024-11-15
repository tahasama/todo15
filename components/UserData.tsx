import { auth } from "@/auth";

export default async function UserData() {
  const session = await auth();

  console.log("🚀 ~ UserData ~ session000:", session);

  if (!session?.user) return null;

  return (
    <div>
      {/* <p>{session.user.name}</p> */}
      {/* <p>{session.user.email}</p> */}
      {/* <p>{session.user.id}</p> */}
    </div>
  );
}
