import LoginForm from "@/components/auth/LoginForm";

// Support both legacy sync object and new async searchParams (Next.js 15+) by
// allowing either a plain object or a Promise. Using `await` on a non-Promise
// value returns the value unchanged, so this is safe and future-proof.
type LoginPageProps = {
  searchParams:
    | { from?: string | string[] }
    | Promise<{ from?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams; // Handle potential Promise per Next.js 15 dynamic API guidance
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
