# Guía de Migración: Vercel → Cloudflare Pages

> **Tipo:** Runbook técnico  
> **Estado:** Borrador - Listo para cuando se active  
> **Fecha creación:** 2026-03-02  
> **Trigger:** Compra de dominio `zynch.app` o llegada a 10+ tenants

---

## Resumen

Esta guía documenta el proceso de migración del frontend de Zynch desde Vercel hacia Cloudflare Pages, manteniendo Convex como backend serverless.

**Motivación:**
- Reducir costos operativos (Vercel cobra por bandwidth, Cloudflare Pages es gratuito)
- CDN global más rápido (Cloudflare tiene 300+ locations vs 100+ de Vercel)
- Mayor control sobre dominio y DNS
- Mejor integración con R2 (storage sin egress fees)

---

## Pre-requisitos

- [ ] Dominio `zynch.app` comprado y disponible
- [ ] Cuenta Cloudflare (gratis)
- [ ] Repositorio en GitHub (ya existe)
- [ ] Convex backend funcionando (ya existe)
- [ ] Acceso admin a Vercel actual (para backup)

---

## Paso 1: Preparar Next.js para Static Export

### 1.1 Modificar `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  // Convex requiere dynamic rendering, así que usaremos SSR en edge
  // Pero para Cloudflare Pages, configuramos como static
  images: {
    unoptimized: true, // Necesario para static export
  },
  // Configuración para que Convex funcione desde static site
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },
};

export default nextConfig;
```

### 1.2 Verificar que no hay rutas dinámicas sin `generateStaticParams`

Revisar estas páginas:
- `app/[tenant]/page.tsx` → Debe usar `generateStaticParams`
- `app/agendar/page.tsx` → Debe cargar tenant dinámicamente vía client-side

```typescript
// Ejemplo de generación estática por tenant
export async function generateStaticParams() {
  // En build time, obtener lista de tenants de Convex
  // O usar fallback: true para CSR
  return [
    { tenant: 'karla-spice' },
    // ... otros tenants conocidos en build time
  ];
}
```

### 1.3 Mover data fetching a cliente donde sea necesario

Cloudflare Pages (static) + Convex requiere:

```typescript
// ANTES (Server Component con Vercel)
const config = await fetchSiteConfig(tenantId);

// DESPUÉS (Client Component para Cloudflare)
'use client';
const { data: config } = useQuery(api.siteConfig.get, { slug: tenantSlug });
```

---

## Paso 2: Configurar Cloudflare

### 2.1 Conectar repositorio GitHub

1. Ir a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → "Create a project"
3. Conectar cuenta GitHub → Seleccionar repo `iwaigit/Zynch`
4. Configurar build:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `web-app` (si usamos monorepo)

### 2.2 Variables de entorno

En Cloudflare Pages → Settings → Environment variables:

```
NEXT_PUBLIC_CONVEX_URL=https://clever-ox-123.convex.cloud
NEXT_PUBLIC_SITE_URL=https://zynch.app
CONVEX_DEPLOYMENT_URL=https://clever-ox-123.convex.cloud
```

**Importante:** Cloudflare Pages usa Node.js 18 por defecto. Verificar compatibilidad.

---

## Paso 3: Configurar Dominio

### 3.1 Transferir DNS a Cloudflare

1. En registrar de dominio (donde compraste zynch.app), cambiar nameservers:
   ```
   lara.ns.cloudflare.com
   greg.ns.cloudflare.com
   ```
2. Esperar propagación (5 min - 48 horas)

### 3.2 Conectar dominio a Pages

1. Cloudflare Pages → Zynch project → Custom domains
2. Add custom domain: `zynch.app`
3. Add custom domain: `*.zynch.app` (para subdominios de tenants)
4. Cloudflare genera SSL automáticamente (Let's Encrypt)

### 3.3 Configurar subdominios dinámicos

Para routing de tenants por subdominio:

```javascript
// _routes.json en build output
{
  "version": 1,
  "include": ["/*"],
  "exclude": []
}
```

Y en el código:
```typescript
// Detectar tenant por subdominio o path
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const tenantSlug = hostname.replace('.zynch.app', '') || 'default';
```

---

## Paso 4: Configurar Storage (R2)

### 4.1 Crear bucket R2

1. Cloudflare dashboard → R2
2. Create bucket: `zynch-assets`
3. Settings:
   - Public access: OFF (acceso vía API/Worker)
   - CORS: Permitir `https://zynch.app` y `*.zynch.app`

### 4.2 Migrar imágenes desde Convex Storage

```bash
# Script de migración (correr localmente)
npx ts-node scripts/migrate-storage.ts
```

```typescript
// scripts/migrate-storage.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Descargar desde Convex Storage y subir a R2
```

### 4.3 Actualizar URLs en Convex

Modificar `siteConfig.ts` para usar R2 URLs:

```typescript
// Generar URL firmada de R2 en lugar de Convex Storage
const r2Url = `https://zynch-assets.zynch.app/${tenantId}/${filename}`;
```

---

## Paso 5: Configurar Functions (Opcional)

Si necesitas serverless functions (ej: webhooks, API routes):

### 5.1 Cloudflare Workers

```typescript
// functions/api/webhook.ts
export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Webhook de Stripe
  const payload = await request.json();
  
  // Llamar a Convex mutation
  const response = await fetch(env.CONVEX_URL + '/api/mutations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.CONVEX_ADMIN_KEY}` },
    body: JSON.stringify({
      mutation: 'stripe:handleWebhook',
      args: [payload]
    })
  });
  
  return new Response('OK');
}
```

### 5.2 Ventaja sobre Vercel Functions

- Cloudflare Workers: Edge deployment (200+ locations)
- Cold start: 0ms (vs 100-500ms en Vercel)
- Pricing: 100,000 requests/día gratis (vs 1M en Vercel)

---

## Paso 6: Testing antes de DNS Switch

### 6.1 Preview deployments

Cloudflare Pages genera URLs preview por cada PR:
- `https://zynch-branch-name.pages.dev`

### 6.2 Checklist de verificación

- [ ] Homepage carga correctamente
- [ ] Tenant switching funciona (karla-spice.zynch.app)
- [ ] Convex queries responden
- [ ] Autenticación funciona
- [ ] Upload de imágenes (ahora a R2)
- [ ] Stripe payments procesan
- [ ] Webhooks llegan correctamente
- [ ] SEO meta tags renderizan

### 6.3 Performance testing

```bash
# Instalar wrangler CLI
npm install -g wrangler

# Test desde múltiples locations
wrangler pages deployment list
wrangler pages deployment tail
```

---

## Paso 7: Switch de DNS (Go Live)

### 7.1 Pre-migración (1 día antes)

1. Setear TTL bajo en DNS (300 segundos)
2. Notificar tenants de posible downtime (< 5 min)
3. Backup de base de datos Convex (snapshot)

### 7.2 Migración (día H)

```bash
# 1. Pausar deploys en Vercel (evitar conflictos)
# 2. Cambiar DNS records:

# ANTES (Vercel)
zynch.app.        300  IN  CNAME  cname.vercel-dns.com.
*.zynch.app.      300  IN  CNAME  cname.vercel-dns.com.

# DESPUÉS (Cloudflare)
zynch.app.        300  IN  CNAME  zynch.pages.dev.
*.zynch.app.      300  IN  CNAME  zynch.pages.dev.
```

### 7.3 Post-migración

1. Verificar SSL certificado activo
2. Monitorear errores (Sentry o Cloudflare Logs)
3. Testear flujo crítico: registro → cita → pago
4. 24h después: Subir TTL a valores normales (3600)

---

## Paso 8: Cleanup

### 8.1 Una semana después (si todo estable)

- [ ] Cancelar proyecto Vercel (o pausar billing)
- [ ] Eliminar imágenes duplicadas en Convex Storage
- [ ] Documentar costos reales comparados
- [ ] Update runbooks internos

---

## Costos Comparativos (Estimado mensual)

| Servicio | Vercel (actual) | Cloudflare (propuesto) |
|----------|----------------|----------------------|
| Hosting | $20/mes (Pro) | $0 (Pages free) |
| Bandwidth | $0 (hasta 1TB) | $0 (ilimitado) |
| Functions | $0 (hasta 1M) | $0 (hasta 100K/día) |
| Storage | N/A (usas Convex) | $0.015/GB (R2) |
| **Total estimado** | **$20-50/mes** | **$5-15/mes** |

**Ahorro:** ~60-70% en costos operativos

---

## Rollback Plan

Si algo falla gravemente:

```bash
# 1. Revertir DNS inmediatamente
# Cambiar CNAMEs de vuelta a Vercel

# 2. Vercel mantiene deploy anterior activo
vercel --prod  # Redeploy última versión estable

# 3. Tiempo máximo de rollback: 10 minutos (TTL DNS)
```

---

## Checklist Final

- [ ] Next.js configurado para static export
- [ ] Todas las queries funcionan client-side
- [ ] Cloudflare Pages conectado a GitHub
- [ ] Dominio `zynch.app` transferido a Cloudflare
- [ ] SSL funcionando en `zynch.app` y `*.zynch.app`
- [ ] R2 bucket creado y configurado
- [ ] Imágenes migradas desde Convex Storage
- [ ] Environment variables configuradas
- [ ] Webhooks migrados a Cloudflare Workers (si aplica)
- [ ] Testing completo en preview URL
- [ ] Plan de rollback documentado
- [ ] Fecha de migración coordinada con IWAI team

---

## Notas Adicionales

### Convex sigue siendo el backend

Cloudflare Pages solo reemplaza el **frontend hosting**. Convex permanece como:
- Base de datos (serverless)
- Autenticación
- Functions/mutations
- Real-time subscriptions

### Limitaciones conocidas

1. **Next.js API Routes:** No funcionan en static export. Migrar a:
   - Convex functions (preferido)
   - Cloudflare Workers
   - Serverless separado

2. **Image Optimization:** `next/image` requiere `unoptimized: true`. Alternativas:
   - Cloudflare Images (servicio aparte, $1/1000 imágenes)
   - R2 + Cloudflare Polish (automático en Pro)

3. **Edge Middleware:** Reemplazar `middleware.ts` con:
   - Cloudflare Functions
   - Client-side routing detection
   - Cloudflare Transform Rules

---

## Recursos

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Cloudflare R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [Convex Best Practices](https://docs.convex.dev/best-practices)

---

**Documento preparado por:** IWAI - Automated Processes  
**Última actualización:** 2026-03-02  
**Próxima revisión:** Cuando se active compra de dominio

---

© 2026 **IWAI - Automated Processes** | [www.iwai.work](https://www.iwai.work)
