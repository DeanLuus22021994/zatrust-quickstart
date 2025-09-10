import LoginForm from "@/components/auth/LoginForm";

// Next.js 15 searchParams is always a Promise or undefined
type LoginPageProps = {
  searchParams?: Promise<{ from?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};
  let from = params.from;
  if (Array.isArray(from)) from = from[0];
  // Basic normalization: only keep internal relative paths starting with '/'
  const normalizedFrom =
    typeof from === "string" && from.startsWith("/") ? from : undefined;
  return (
    <section>
      <h1>Login</h1>
      <LoginForm from={normalizedFrom} />
    </section>
  );
}
