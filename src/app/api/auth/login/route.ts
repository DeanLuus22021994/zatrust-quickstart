import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { sanitizeRedirectPath, validateUsername } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const { ok, value } = validateUsername(formData.get("username"));
  const fromRaw = formData.get("from") || "/dashboard";
  const from = sanitizeRedirectPath(fromRaw);

  if (!ok) {
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

  return NextResponse.redirect(new URL(from, request.url));
}
