import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { config as appConfig } from "@/lib/config";
import { SESSION_CONFIG } from "@/lib/session";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has(SESSION_CONFIG.cookieName);
  const url = new URL(request.url);

  const protectedPrefixes = appConfig.auth.protectedPrefixes;
  if (
    protectedPrefixes.some((p: string) => url.pathname.startsWith(p)) &&
    !isLoggedIn
  ) {
    const loginUrl = new URL(appConfig.auth.loginPath, request.url);
    loginUrl.searchParams.set(appConfig.auth.redirectParam, url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
