import { DashboardContent, UnauthenticatedView } from "@/components/dashboard/DashboardContent";
import { logger } from "@/lib/logger";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardPage() {
  try {
    logger.debug("Dashboard page rendering started");
    
    const user = await getCurrentUser();
    
    logger.debug("Dashboard user check", { 
      userExists: !!user, 
      username: user?.username
    });

    if (!user) {
      logger.warn("Dashboard accessed without valid user session");
    }

    return (
      <section>
        <h1>Dashboard</h1>
        {user ? (
          <DashboardContent user={user} />
        ) : (
          <UnauthenticatedView />
        )}
      </section>
    );
  } catch (error) {
    logger.error("Dashboard page error", error instanceof Error ? error : new Error(String(error)));
    throw error; // Re-throw to trigger error boundary
  }
}
