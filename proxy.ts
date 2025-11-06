import { NextResponse } from "next/server";
import { getToken, JWT } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  const isAuthPage = req.nextUrl.pathname === "/"; // Your login page is at root
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  // Handle NextAuth error redirects - redirect to home page with error param
  if (isApiAuthRoute && req.nextUrl.pathname === "/api/auth/error") {
    const error = req.nextUrl.searchParams.get("error");
    if (error) {
      // Redirect to home page with the error parameter
      const homeUrl = new URL("/", req.url);
      homeUrl.searchParams.set("error", error);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Allow API auth routes (except error which we handle above)
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  const isAdmin = Boolean((token as JWT)?.isSystemAdmin);
  const isSysAdminRoute = req.nextUrl.pathname.startsWith("/sys-admin");
  const isDfRoute = req.nextUrl.pathname.startsWith("/df");

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Block access to sys-admin routes if not system admin
  if (isAuthenticated && isSysAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/df", req.url));
  }

  // Block access to df routes if system admin
  if (isAuthenticated && isDfRoute && isAdmin) {
    return NextResponse.redirect(new URL("/sys-admin", req.url));
  }

  // Redirect authenticated users away from login page
  // BUT allow them to stay if there's an error parameter (for displaying errors)
  if (isAuthenticated && isAuthPage) {
    const hasError = req.nextUrl.searchParams.has("error");
    if (!hasError) {
      const target = isAdmin ? "/sys-admin" : "/df";
      return NextResponse.redirect(new URL(target, req.url));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/',
    '/api/auth/error',
    '/sys-admin/:path*',
    '/df/:path*',
    '/admins/:path*',
    '/categories/:path',
    '/change-password/:path*'
  ],
};