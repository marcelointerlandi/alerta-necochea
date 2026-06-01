import { NextRequest, NextResponse } from 'next/server';

const PREVIEW_TOKEN = process.env.PREVIEW_TOKEN;
const COOKIE_NAME = '__inf_preview';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const SITE = 'https://informatenecochea.com';

const SOCIAL_BOTS = [
  'whatsapp', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'telegrambot', 'slackbot', 'discordbot', 'googlebot',
];

function isSocialBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return SOCIAL_BOTS.some((bot) => ua.includes(bot));
}

export async function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // --- preview token logic ---
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

  // --- og:image para bots de redes sociales ---
  const noticiaMatch = pathname.match(/^\/noticia\/([^/]+)$/);
  if (noticiaMatch && isSocialBot(userAgent)) {
    const slug = noticiaMatch[1];
    try {
      const res = await fetch(`${API}/api/noticias/${slug}`);
      if (res.ok) {
        const n = await res.json();
        const imagen = n.imagen_url || '';
        const titulo = n.titulo || 'Informate Necochea';
        const descripcion = n.copete || titulo;
        const url = `${SITE}/noticia/${n.slug}`;

        const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <title>${titulo}</title>
  <meta name="description" content="${descripcion.replace(/"/g, '&quot;')}"/>
  <meta property="og:title" content="${titulo.replace(/"/g, '&quot;')}"/>
  <meta property="og:description" content="${descripcion.replace(/"/g, '&quot;')}"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:type" content="article"/>
  <meta property="og:site_name" content="Informate Necochea"/>
  ${imagen ? `<meta property="og:image" content="${imagen}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>` : ''}
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${titulo.replace(/"/g, '&quot;')}"/>
  <meta name="twitter:description" content="${descripcion.replace(/"/g, '&quot;')}"/>
  ${imagen ? `<meta name="twitter:image" content="${imagen}"/>` : ''}
  <meta http-equiv="refresh" content="0; url=${url}"/>
</head>
<body></body>
</html>`;

        return new NextResponse(html, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
    } catch {
      // si falla la API, pasa al render normal
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|proximamente.png).*)'],
};
