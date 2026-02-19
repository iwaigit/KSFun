import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
    const auth = request.cookies.get('ks-auth');
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    
    if (isAdminRoute && !auth) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};