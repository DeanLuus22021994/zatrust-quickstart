import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams: { from?: string };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const cookieStore = await cookies();
  // cookies() in App Router returns a RequestCookies object (not promise) in stable versions; adjust if typing mismatch persists.
  if (cookieStore.get("demo_user")) {
    redirect("/dashboard");
  }
  return (
    <section>
      <h1>Login</h1>
      <LoginForm from={searchParams.from} />
    </section>
  );
}
