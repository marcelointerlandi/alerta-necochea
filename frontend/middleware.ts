import { NextRequest, NextResponse } from 'next/server';

const PREVIEW_TOKEN = process.env.PREVIEW_TOKEN;
const COOKIE_NAME = '__inf_preview';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const previewParam = searchParams.get('preview');

  if (previewParam === 'salir') {
    const url = request.nextUrl.clone();
    url.searchParams.delete('preview');
    const response = NextResponse.redirect(url);
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  if (previewParam && PREVIEW_TOKEN && previewParam === PREVIEW_TOKEN) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('preview');
    const response = NextResponse.redirect(url);
    response.cookies.set(COOKIE_NAME, PREVIEW_TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|proximamente.png).*)'],
};
