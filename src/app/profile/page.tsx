import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const user = cookieStore.get("demo_user")?.value;
  return (
    <main className="space-y-4">
      <h1>Profile</h1>
      <p>
        {user
          ? `User: ${user}`
          : "No authenticated user detected. (Middleware should redirect before rendering.)"}
      </p>
      <p>This is a demo protected profile page.</p>
    </main>
  );
}
