import LoginForm from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams: { from?: string };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // cookies() in App Router returns a RequestCookies object (not promise) in stable versions; adjust if typing mismatch persists.
  return (
    <section>
      <h1>Login</h1>
      <LoginForm from={searchParams.from} />
    </section>
  );
}
