import LoginForm from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return (
    <section>
      <h1>Login</h1>
      <LoginForm from={params.from} />
    </section>
  );
}
