import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api-utils";
import { config } from "@/lib/config";
import { logger } from "@/lib/logger";
import { clearUserSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    logger.info("Logout attempt started");
    
    await clearUserSession();
    
    logger.info("Logout successful, redirecting to home");
    return NextResponse.redirect(new URL(config.auth.homePath, request.url), 302);
  } catch (error) {
    return handleApiError(error, "Logout");
  }
}
