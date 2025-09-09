import LoginForm from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams: { from?: string };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <section>
      <h1>Login</h1>
      <LoginForm from={searchParams.from} />
    </section>
  );
}
