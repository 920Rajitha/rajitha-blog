import { NextResponse } from "next/server";

export function middleware(req) {
  const isLoggedIn = req.cookies.get("admin");

  if (!isLoggedIn && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/admin-login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard"],
};