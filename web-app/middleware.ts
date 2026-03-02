import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Tenant Detection Middleware
 * 
 * Detecta el tenant activo por:
 * 1. Subdominio: karla-spice.zynch.app → tenant "karla-spice"
 * 2. Path: zynch.app/karla-spice → tenant "karla-spice"
 * 3. Fallback: default tenant (first tenant)
 * 
 * El middleware inyecta el tenantSlug en los headers para que
 * los Server Components puedan acceder a él.
 */

// Dominios públicos donde NO aplicamos detección de tenant
const PUBLIC_DOMAINS = [
  'localhost',
  'zynch.vercel.app',
];

// Rutas que NO requieren detección de tenant (API, archivos estáticos, etc.)
const PUBLIC_PATHS = [
  '/_next',
  '/static',
  '/api',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
];

// Rutas de sistema que no son tenants
const SYSTEM_PATHS = [
  '/admin',
  '/login',
  '/register',
  '/api',
  '/_debug',
];

/**
 * Extrae el subdominio del hostname
 * Ej: "karla-spice.zynch.app" → "karla-spice"
 * Ej: "www.zynch.app" → null (www es reservado)
 */
function extractSubdomain(hostname: string): string | null {
  // Remover puerto si existe
  const cleanHostname = hostname.split(':')[0];
  
  // Si es localhost o IP, no hay subdominio
  if (cleanHostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(cleanHostname)) {
    return null;
  }
  
  const parts = cleanHostname.split('.');
  
  // Dominio simple: zynch.app (2 partes)
  // Subdominio: karla-spice.zynch.app (3 partes)
  // WWW: www.zynch.app (ignorar www)
  
  if (parts.length >= 3) {
    const subdomain = parts[0];
    
    // Ignorar subdominios reservados
    const RESERVED_SUBDOMAINS = [
      'www', 'admin', 'api', 'app', 'dashboard',
      'mail', 'ftp', 'smtp', 'pop', 'imap'
    ];
    
    if (!RESERVED_SUBDOMAINS.includes(subdomain)) {
      return subdomain.toLowerCase();
    }
  }
  
  return null;
}

/**
 * Extrae el tenant del path
 * Ej: "/karla-spice/galeria" → "karla-spice"
 * Ej: "/galeria" → null
 */
function extractTenantFromPath(pathname: string): string | null {
  // Remover query params y hash
  const cleanPath = pathname.split('?')[0].split('#')[0];
  
  // Dividir por slashes
  const segments = cleanPath.split('/').filter(Boolean);
  
  // Si el primer segmento existe y parece un slug de tenant
  if (segments.length > 0) {
    const firstSegment = segments[0].toLowerCase();
    
    // No es un path de sistema
    if (!SYSTEM_PATHS.some(sys => sys === `/${firstSegment}`)) {
      // Verificar que parezca un slug válido (letras, números, guiones)
      if (/^[a-z0-9-]+$/.test(firstSegment) && firstSegment.length >= 2) {
        return firstSegment;
      }
    }
  }
  
  return null;
}

/**
 * Verifica si la ruta actual es pública (no necesita tenant)
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(public => pathname.startsWith(public)) ||
         SYSTEM_PATHS.some(sys => pathname.startsWith(sys));
}

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // 1. Ignorar rutas públicas
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // 2. Intentar detectar por subdominio primero (más específico)
  let tenantSlug = extractSubdomain(hostname);
  let detectionMethod = 'subdomain';
  
  // 3. Si no hay subdominio, intentar por path
  if (!tenantSlug) {
    tenantSlug = extractTenantFromPath(pathname);
    detectionMethod = 'path';
  }
  
  // 4. Crear respuesta modificada
  const response = NextResponse.next();
  
  // 5. Inyectar tenant en headers
  // Estos headers estarán disponibles en Server Components
  if (tenantSlug) {
    response.headers.set('x-tenant-slug', tenantSlug);
    response.headers.set('x-tenant-detection', detectionMethod);
  } else {
    // Fallback: usar default tenant
    response.headers.set('x-tenant-slug', 'default');
    response.headers.set('x-tenant-detection', 'fallback');
  }
  
  // 6. Si detectamos por path, reescribir la URL interna
  // para que Next.js maneje la ruta correctamente
  if (detectionMethod === 'path' && tenantSlug) {
    // Ej: /karla-spice/galeria → reescribir a /galeria con tenantSlug en header
    const newPathname = pathname.replace(`/${tenantSlug}`, '') || '/';
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = newPathname;
    
    return NextResponse.rewrite(newUrl, {
      headers: response.headers,
    });
  }
  
  return response;
}

/**
 * Configuración del matcher
 * Define en qué rutas se ejecuta el middleware
 */
export const config = {
  matcher: [
    // Excluir archivos estáticos y API
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.).*)',
  ],
};
