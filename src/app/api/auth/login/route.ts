import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api-utils";
import { sanitizeRedirectPath } from "@/lib/auth";
import { config } from "@/lib/config";
import { logger } from "@/lib/logger";
import { setUserSession } from "@/lib/session";
import { validateLoginForm } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    logger.info("Login attempt started");
    
    const formData = await request.formData();
    
    // Use new validation utilities
    const validationResult = validateLoginForm(formData);
    if (!validationResult.success) {
      logger.warn("Login failed: validation error", { errors: validationResult.errors });
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.errors },
        { status: 400 }
      );
    }

    const fromRaw = formData.get("from") || config.app.defaultRedirect;
    const from = sanitizeRedirectPath(fromRaw, config.app.defaultRedirect);

    logger.debug("Login data", { username: validationResult.data.username, from, fromRaw });

    const { username } = validationResult.data;
    if (!username) {
      throw new Error("Username is required but missing after validation");
    }
    
    await setUserSession(username);

    logger.info("Login successful, redirecting", { 
      username, 
      destination: from 
    });
    
    // Use a 302 redirect instead of 307 to avoid potential ERR_FAILED issues
    const redirectUrl = new URL(from, request.url);
    const response = NextResponse.redirect(redirectUrl, 302);
    
    return response;
  } catch (error) {
    return handleApiError(error, "Login");
  }
}
