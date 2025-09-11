import { NextResponse } from "next/server";

import { sanitizeRedirectPath, validateUsername } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { setUserSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    logger.info("Login attempt started");
    
    const formData = await request.formData();
    const { ok, value } = validateUsername(formData.get("username"));
    const fromRaw = formData.get("from") || "/dashboard";
    const from = sanitizeRedirectPath(fromRaw);

    logger.debug("Login data", { username: value, from, fromRaw });

    if (!ok) {
      logger.warn("Login failed: invalid username");
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    await setUserSession(value);

    logger.info("Login successful, redirecting", { username: value, destination: from });
    
    // Use a 302 redirect instead of 307 to avoid potential ERR_FAILED issues
    const redirectUrl = new URL(from, request.url);
    const response = NextResponse.redirect(redirectUrl, 302);
    
    return response;
  } catch (error) {
    logger.error("Login error", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: "Internal server error during login" },
      { status: 500 }
    );
  }
}
