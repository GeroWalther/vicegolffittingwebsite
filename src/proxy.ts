import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const ok = token ? await verifyAdminCookie(token) : false;
    if (!ok) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) return NextResponse.next();

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
