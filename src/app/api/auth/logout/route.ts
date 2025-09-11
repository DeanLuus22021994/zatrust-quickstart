import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { clearUserSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    logger.info("Logout attempt started");
    
    await clearUserSession();
    
    logger.info("Logout successful, redirecting to home");
    return NextResponse.redirect(new URL("/", request.url), 302);
  } catch (error) {
    logger.error("Logout error", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: "Internal server error during logout" },
      { status: 500 }
    );
  }
}
