import { NextRequest, NextResponse } from "next/server";

const requiresRedirectForLoggedInUser = (path: string) =>
  ["/login", "/signup"].includes(path);

const PUBLIC_URLS = ["/", "/login", "/signup"];

export async function middleware(request: NextRequest) {
  const session = await fetch(
    request.nextUrl.origin + "/api/auth/get-session",
    {
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    }
  )
    .then((res) => res.json())
    .catch(() => ({ session: null }));

  if (session?.session) {
    // user is logged in
    if (requiresRedirectForLoggedInUser(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // user is not logged in
  if (!PUBLIC_URLS.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/chat/:path*", "/login", "/signup"],
};
