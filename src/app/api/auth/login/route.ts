import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { sanitizeRedirectPath, validateUsername } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    console.log("Login attempt started");
    
    const formData = await request.formData();
    const { ok, value } = validateUsername(formData.get("username"));
    const fromRaw = formData.get("from") || "/dashboard";
    const from = sanitizeRedirectPath(fromRaw);

    console.log("Login data:", { username: value, from, fromRaw });

    if (!ok) {
      console.log("Login failed: invalid username");
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("demo_user", value, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    console.log("Login successful, redirecting to:", from);
    
    // Use a 302 redirect instead of 307 to avoid potential ERR_FAILED issues
    const redirectUrl = new URL(from, request.url);
    const response = NextResponse.redirect(redirectUrl, 302);
    
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error during login" },
      { status: 500 }
    );
  }
}
