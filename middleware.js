import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// These are the routes that require authentication
const protectedRoutes = ["/dashboard", "/checkout", "/orders", "/wishlist", "/profile"];

// These are the routes that require specific roles
const vendorRoutes = ["/vendor"];
const adminRoutes = ["/admin"];

// These routes should redirect to home if the user IS logged in
const authRoutes = ["/login", "/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Read the token from cookies
  const token = request.cookies.get("token");
  let user = null;

  // Try to verify the token
  if (token) {
    try {
      user = verifyToken(token.value);
    } catch (error) {
      // Token is invalid — treat as logged out
      user = null;
    }
  }

  // If the user is logged in and tries to visit login/register
  // redirect them to home — they're already authenticated
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If the route requires authentication and user is not logged in
  // redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If the route requires vendor role
  if (vendorRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.role !== "vendor" && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If the route requires admin role
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Tell Next.js which routes this middleware should run on
// We exclude static files, images, and Next.js internals
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};