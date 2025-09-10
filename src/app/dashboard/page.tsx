import { cookies } from "next/headers";

export default async function DashboardPage() {
  try {
    console.log("Dashboard page rendering started");
    
    const cookieStore = await cookies();
    const user = cookieStore.get("demo_user");
    
    console.log("Dashboard user check:", { 
      userExists: !!user, 
      username: user?.value,
      timestamp: new Date().toISOString()
    });

    if (!user) {
      console.warn("Dashboard accessed without valid user cookie");
    }

    return (
      <section>
        <h1>Dashboard</h1>
        {user ? (
          <>
            <p>Welcome, {user.value}</p>
            <form action="/api/auth/logout" method="post">
              <button type="submit">Logout</button>
            </form>
            <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666' }}>
              <p>Debug info: Loaded at {new Date().toISOString()}</p>
            </div>
          </>
        ) : (
          <div>
            <p>You are not logged in.</p>
            <a href="/login">Go to Login</a>
          </div>
        )}
      </section>
    );
  } catch (error) {
    console.error("Dashboard page error:", error);
    throw error; // Re-throw to trigger error boundary
  }
}
