import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Permitir todas las rutas API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Manejar solicitudes CORS
    const response = NextResponse.next();

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    // Responder a solicitudes preflight OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
