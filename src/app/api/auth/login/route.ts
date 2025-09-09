import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "guest");
  const from = String(formData.get("from") || "/dashboard");

  cookies().set("demo_user", username, {
    httpOnly: true, // Improved security: prevent client-side access
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // Secure in production
  });

  return NextResponse.redirect(new URL(from, request.url));
}
