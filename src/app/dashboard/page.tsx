import { cookies } from 'next/headers';

export default function DashboardPage() {
  const cookieStore = cookies();
  const user = cookieStore.get('demo_user');

  return (
    <section>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, {user.value}</p>
          <form action="/api/auth/logout" method="post">
            <button type="submit">Logout</button>
          </form>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </section>
  );
}
