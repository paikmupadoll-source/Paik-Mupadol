import { NextResponse } from "next/server";

export function middleware(request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return new NextResponse("ADMIN_PASSWORD belum diatur di Environment Variables.", { status: 503 });
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const suppliedPassword = decoded.slice(decoded.indexOf(":") + 1);
      if (decoded.includes(":") && suppliedPassword === password) return NextResponse.next();
    } catch {}
  }
  return new NextResponse("Akses admin memerlukan autentikasi.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin Portofolio", charset="UTF-8"' }
  });
}
export const config = { matcher: ["/admin/:path*"] };
