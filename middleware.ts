import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. เช็ก path '/' ก่อนเป็นอันดับแรก
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. ค่อยมาเช็ก Token สำหรับ Path อื่นๆ
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // (โค้ดส่วนที่เหลือ...)
  const protectedPaths = ['/dashboard', '/profile', '/jobs/new'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  const authPaths = ['/login', '/register'];
  const isAuthRoute = authPaths.some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard/seeker', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};