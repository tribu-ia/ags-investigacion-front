import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que no requieren autenticación
const publicPaths = ["/", "/auth/login", "/auth/callback"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir acceso a rutas públicas
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verificar token en las cookies
  const token = request.cookies.get("kc-access");
  
  // Si no hay token, redirigir al login
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 