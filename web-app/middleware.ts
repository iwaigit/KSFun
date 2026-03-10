import { NextRequest, NextResponse } from 'next/server';
import { getTenantInfo, isValidTenantSlug } from './lib/tenant-detection';

/**
 * Middleware principal de Zynch - Detección de Tenant
 * 
 * Flujo:
 * 1. www.zynch.app → Landing de marketing
 * 2. admin.zynch.app → Dashboard de administración
 * 3. {slug}.zynch.app → Sitio personal del tenant
 */
export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const url = req.nextUrl;
  
  console.log(`🔍 Middleware: Processing ${hostname}`);
  
  try {
    // 1. Marketing - Landing page
    if (hostname === 'www.zynch.app' || hostname === 'zynch.app') {
      console.log('📱 Routing to marketing landing');
      return NextResponse.rewrite(new URL('/landing', url));
    }
    
    // 2. Admin Dashboard
    if (hostname === 'admin.zynch.app') {
      console.log('⚙️ Routing to admin dashboard');
      return NextResponse.rewrite(new URL('/admin', url));
    }
    
    // 3. Tenant Sites - Subdominios
    if (hostname.includes('.zynch.app') && hostname !== 'admin.zynch.app') {
      const tenantSlug = hostname.replace('.zynch.app', '');
      
      // Validar slug format
      if (!isValidTenantSlug(tenantSlug)) {
        console.log(`❌ Invalid tenant slug: ${tenantSlug}`);
        return NextResponse.redirect(new URL('/invalid-tenant', url));
      }
      
      console.log(`🏢 Looking for tenant: ${tenantSlug}`);
      
      // Verificar tenant usando helper
      const tenant = await getTenantInfo(tenantSlug);
      
      if (!tenant) {
        console.log(`❌ Tenant not found or inactive: ${tenantSlug}`);
        return NextResponse.redirect(new URL('/tenant-not-found', url));
      }
      
      console.log(`✅ Tenant found: ${tenantSlug} (${tenant._id})`);
      
      // Inyectar información del tenant en headers
      const response = NextResponse.rewrite(new URL('/tenant-site', url));
      
      response.headers.set('x-tenant-slug', tenantSlug);
      response.headers.set('x-tenant-id', tenant._id);
      response.headers.set('x-tenant-name', tenant.name);
      response.headers.set('x-tenant-plan', tenant.planType);
      response.headers.set('x-tenant-alias', tenant.alias || tenant.name);
      
      return response;
    }
    
    // 4. Default - Redirigir a marketing
    console.log('🔄 Default redirect to marketing');
    return NextResponse.redirect(new URL('https://www.zynch.app', url));
    
  } catch (error) {
    console.error('💥 Middleware error:', error);
    
    // En caso de error, redirigir a marketing
    return NextResponse.redirect(new URL('https://www.zynch.app', url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
