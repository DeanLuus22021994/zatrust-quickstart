import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("demo_user");
  return NextResponse.redirect(new URL("/", request.url));
}
