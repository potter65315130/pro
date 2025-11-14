import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // เช็ก Token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Protected paths ที่ต้อง login ก่อน
  const protectedPaths = ['/dashboard', '/profile', '/jobs/new'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // Auth paths (login, register)
  const authPaths = ['/login', '/register'];
  const isAuthRoute = authPaths.some(path => pathname.startsWith(path));

  // ถ้าเข้า protected path แต่ยัง login ไม่ได้ → ไป login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // ถ้า login แล้วแต่พยายามเข้า login/register → ไป dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard/seeker', req.url));
  }

  // ถ้าเข้าหน้าแรก '/' และ login แล้ว → ไป dashboard
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard/seeker', req.url));
  }

  // ไม่งั้นให้ผ่านไปได้ (รวมถึงหน้าแรกสำหรับคนที่ยัง login ไม่ได้)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};