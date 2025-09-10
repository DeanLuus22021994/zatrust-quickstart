import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("Logout attempt started");
    
    const cookieStore = await cookies();
    cookieStore.delete("demo_user");
    
    console.log("Logout successful, redirecting to home");
    return NextResponse.redirect(new URL("/", request.url), 302);
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error during logout" },
      { status: 500 }
    );
  }
}
