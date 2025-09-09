import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "guest");

  cookies().set("demo_user", username, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
  });

  const from = new URL(request.url).searchParams.get("from") || "/dashboard";
  return NextResponse.redirect(new URL(from, request.url));
}
