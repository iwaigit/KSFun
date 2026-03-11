# Propuesta de Profesionalización - Zynch SaaS

> **Fecha:** 2026-03-09  
> **Autor:** IWAI - Automated Processes (Alberto CEO + Pablo Weber)  
> **Dominio Oficial:** zynch.app
> **Estado:** Implementación de Infraestructura y Skills  
> **Versión:** 1.1

---

## Resumen Ejecutivo

Zynch by iwai ha evolucionado de una implementación personalizada a una plataforma SaaS multi-tenant "camaleónica". Este documento propone una arquitectura profesional para escalar el producto, permitir nuevos clientes (tenants) de forma automatizada y establecer la base para monetización.

---

## 1. Arquitectura de Carpetas SaaS (Monorepo)

Se propone reorganizar el repositorio en un monorepo estructurado:

```
Zynch/
├── apps/
│   ├── web/                    # Frontend único (Next.js) - multi-tenant por diseño
│   │   ├── app/                # Rutas dinámicas por tenant slug
│   │   ├── components/         # Componentes reutilizables
│   │   └── hooks/              # useSiteConfig(), useTenant(), etc.
│   └── admin-dashboard/        # Dashboard para IWAI gestionar todos los tenants
│       ├── tenants/            # CRUD de tenants
│       ├── billing/            # Suscripciones y pagos
│       └── analytics/          # Métricas agregadas
├── packages/
│   ├── shared-config/          # ESLint, TypeScript, Tailwind configs
│   ├── ui-components/          # Design system (shadcn/ui base)
│   └── convex-helpers/         # Utilidades para queries/mutations multi-tenant
├── infra/
│   ├── convex/                 # Schema + functions (ya existe)
│   ├── storage/                # Políticas de almacenamiento por tenant
│   └── edge-config/            # Configuración edge (Vercel)
└── docs/
    ├── saas-core/              # Arquitectura, APIs, decisiones técnicas
    ├── tenants/                # Un subfolder por cliente (zynch-alpha, etc.)
    └── runbooks/               # Procedimientos operativos
```

**Beneficios:**
- Código compartido reduce duplicación
- Despliegues independientes por app
- Escalabilidad para nuevos equipos

---

## 2. Multi-Tenancy Profesional (3 Capas)

### Capa 1: Base de Datos (Convex)
**Estado actual:** ✅ Implementado

```typescript
// Schema actual (ya correcto)
tenants: defineTable({
  name: v.string(),
  slug: v.string(),           // URL identifier: "zynch-alpha"
  ownerId: v.optional(v.id("users")),
  plan: v.string(),           // 'free' | 'pro' | 'enterprise'
  createdAt: v.number(),
}).index("by_slug", ["slug"])

// Todas las tablas tienen tenantId + índice by_tenant
users, appointments, orders, gallery, siteConfig, etc.
```

**Mejoras propuestas:**
- Implementar Row Level Security (RLS) en Convex
- Soft delete por tenant (no borrado físico)
- Data retention policies (GDPR)

### Capa 2: Almacenamiento (Convex Storage)
**Estado actual:** ⚠️ Parcial

```typescript
// Propuesta: Estructura de carpetas virtuales
// /tenants/{tenantId}/
//   ├── profile-images/
//   ├── gallery/
//   └── packs/

// Implementar middleware de upload que:
// 1. Valide el tenantId del usuario autenticado
// 2. Guarde archivos con prefijo del tenant
// 3. Aplique watermark automáticamente
```

### Capa 3: Routing & Edge (Vercel)
**Estado actual:** ❌ No implementado

**Propuesta A: Subdominios (Recomendada)**
```
alpha.zynch.app    → Carga config de "zynch-alpha"
melissa-bennet.zynch.app → Carga config de "melissa-bennet"
```

**Implementación:**
```typescript
// middleware.ts
export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const tenantSlug = hostname.replace('.zynch.app', '');
  
  // Verificar slug existe en Convex
  // Inyectar tenant en headers para usar en layout.tsx
  req.headers.set('x-tenant-slug', tenantSlug);
  return NextResponse.rewrite(req.url);
}
```

**Propuesta B: Path-based (Fallback)**
```
zynch.app/zynch-alpha
zynch.app/melissa-bennet
```

**Propuesta C: Custom Domains (Enterprise)**
```
karlaspice.com → Apunta a Vercel → Carga tenant "karla-spice"
```

---

## 3. Onboarding Automatizado de Tenants

**Flujo completo propuesto:**

```
┌─────────────────────────────────────────────────────────────────┐
│  FASE 1: Registro (IWAI Admin o Self-service)                  │
└─────────────────────────────────────────────────────────────────┘
                         ↓
POST /api/admin/tenants  o  POST /api/onboard (self-service)
{
  "name": "Melissa Bennet",
  "slug": "melissa-bennet",
  "email": "melissa@email.com",
  "plan": "pro"
}
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 2: Provisión Automática                                  │
│  • Crear registro en tabla `tenants`                           │
│  • Crear `siteConfig` con valores por defecto                  │
│  • Crear bucket de storage dedicado                            │
│  • Crear customer en Stripe                                      │
│  • Enviar email de bienvenida con link a setup                 │
└─────────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 3: Setup por el Cliente (Onboarding Wizard)              │
│  • Upload logo y fotos de perfil                               │
│  • Configurar colores de marca                               │
│  • Establecer precios y horarios                               │
│  • Configurar métodos de pago aceptados                        │
│  • Conectar redes sociales                                     │
└─────────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 4: Go Live                                               │
│  • Tenant disponible en {slug}.zynch.fun                       │
│  • IWAI recibe notificación de activación                      │
│  • Comienza tracking de uso para billing                       │
└─────────────────────────────────────────────────────────────────┘
```

**Pantallas del Onboarding Wizard:**

1. **Welcome** - Video introductorio de Zynch
2. **Branding** - Logo, colores, tipografía
3. **Profile** - Bio, stats (Encanto/Estilo/Energía), físico
4. **Services** - Qué ofrece, precios, duración
5. **Schedule** - Días/horarios de trabajo, 24h toggle
6. **Payment** - Métodos aceptados (Ca$h, Pago móvil, Zelle)
7. **Gallery** - Upload de fotos iniciales (con watermark auto)
8. **Review** - Preview de cómo se ve antes de publicar
9. **Publish** - Go live!

---

## 4. Modelos de Negocio (Pricing)

### 4.1 Estructura de Módulos (Elasticidad)

| Módulo | Plan FREE | Plan PRO (IP) | Plan ELITE (PS) |
| :--- | :--- | :--- | :--- |
| **Identidad (ADN Zynch)** | ✅ | ✅ | ✅ |
| **Galería / Fotos** | ✅ (máx 3) | ✅ (máx 12) | ✅ (Ilimitado) |
| **Citas / Agenda** | ✅ | ✅ | ✅ |
| **LinkTree (Botones Custom)** | ❌ | ✅ | ✅ |
| **Packs Virtuales** | ❌ | ❌ | ✅ |
| **Tienda (Carrito/Pagos)** | ❌ | ❌ | ✅ |
| **Efecto Camaleón** | ❌ (ADN Zynch) | ✅ | ✅ |

### 4.2 Estructura de precios:

| Feature | Free | Pro (IP) ($60/mes) | Elite (PS) ($95/mes) | Enterprise ($199/mes) |
|---------|------|---------------|-----------------|-----------------------|
| **Tenants** | 1 | 1 | 1 | Múltiples (franquicia) |
| **Fotos** | 3 | 12 | Ilimitadas | Ilimitadas |
| **Tienda** | No | No | Sí (Packs) | Sí (Full) |
| **Calendario** | Básico | Básico | Ilimitado | Avanzado |
| **Branding** | "Zynch" | Custom domain | Custom domain | White-label |
| **Comisión** | 15% | 10% | 8% | 5% o flat fee |
| **Storage** | 500MB | 5GB | 20GB | 100GB |

### Estrategia de Retención (Commitment Discount):
- **Mensual:** Precio base.
*   **Trimestral (3 meses):** 10% de descuento (Pago único adelantado).
*   **Semestral (6 meses):** 20% de descuento (Mejor valor).

### Revenue Streams:
1. **Suscripción mensual/anual** (MRR)
2. **Comisión por transacción** (citaspagadas, packs vendidos)
3. **Add-ons:** SMS notifications, extra storage, custom domain
4. **Enterprise:** Setup fee ($2,000-5,000) + contrato anual

---

## 5. Separación de Responsabilidades

### IWAI - Automated Processes (Equipo Core)
**Alberto CEO + Pablo Weber**
- Arquitectura y escalabilidad
- Desarrollo de nuevas features
- Seguridad y compliance
- Infraestructura (Vercel, Convex, Stripe)
- Billing y suscripciones
- Soporte técnico nivel 2

### Tenant Admin (Performer/Promoter)
**Ej: Zynch Alpha, Melissa Bennet**
- Contenido (fotos, bio, descripciones)
- Configuración de precios y horarios
- Gestión de citas y pedidos
- Comunicación con clientes
- Marketing personal (redes sociales)

### Clientes Finales (End Users)
- Registro verificado (edad + identidad)
- Agendar citas
- Comprar packs digitales
- Interacción con performer

---

## 6. Seguridad & Compliance

### Row Level Security (RLS) - Prioridad Alta

```typescript
// convex/permissions.ts
export async function requireTenantAccess(
  ctx: QueryCtx | MutationCtx,
  tenantId: Id<"tenants">
) {
  const user = await requireAuth(ctx);
  
  // Admin global puede acceder a todo
  if (user.role === 'admin') return true;
  
  // Usuario debe pertenecer al tenant
  if (user.tenantId !== tenantId) {
    throw new Error("Access denied: Invalid tenant");
  }
  
  return true;
}

// Uso en queries
export const getAppointments = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    await requireTenantAccess(ctx, args.tenantId);
    return ctx.db.query("appointments")
      .withIndex("by_tenant", q => q.eq("tenantId", args.tenantId))
      .collect();
  }
});
```

### GDPR / CCPA Compliance

- **Right to access:** Endpoint para exportar todos los datos del tenant
- **Right to deletion:** Soft delete + purga programada después de 30 días
- **Data retention:** Citas completadas se anonimizan después de 1 año
- **Consent tracking:** Registro de aceptación de términos por usuario

### Rate Limiting

```typescript
// Por tenant: max 100 requests/minuto
// Por IP: max 10 requests/segundo
// Prevenir abuso de endpoints de cita/pago
```

---

## 7. Roadmap de Implementación

### Fase 1: Fundamentos (Semanas 1-2)
- [x] ✅ Implementar RLS en todas las queries/mutations (users, appointments)
- [x] ✅ Separar storage por tenant (prefix en archivos)
- [x] ✅ Crear middleware de detección de tenant
- [ ] Setup Vercel Edge Config para subdominios (postergado para debugging)
- [x] ✅ Probar RLS - Tests completados exitosamente
- [x] ✅ Implementar Anti-Abuso Freemium (WhatsApp único + device fingerprint)
- [x] ✅ Crear estructura de Enterprise (multi-tenant administration)
- [x] ✅ Definir estrategia de precios Enterprise ($80/$140/$200 + $40 extra)

### Fase 2: Admin Dashboard (Semanas 3-4)
- [ ] Crear app `admin-dashboard`
- [ ] CRUD de tenants
- [ ] Vista de analytics agregados
- [ ] Gestión de billing/suscripciones

### Fase 3: Onboarding (Semanas 5-6)
- [ ] Diseñar wizard de onboarding (9 pasos)
- [ ] Implementar flujo de setup inicial
- [ ] Sistema de email notifications
- [ ] Template de welcome email

### Fase 4: Monetización (Semanas 7-8)
- [ ] Integrar Stripe (subscriptions + comisiones)
- [ ] Implementar planes (Free/Pro/Enterprise)
- [ ] Feature flags por plan
- [ ] Billing dashboard para tenants

### Fase 5: Escalabilidad (Semanas 9-10)
- [ ] Migrar a monorepo (Turborepo)
- [ ] Optimizar queries Convex (pagination, caching)
- [ ] CDN para imágenes (Cloudflare/Vercel Edge)
- [ ] Monitoring (Sentry + Convex logs)

---

## 8. Métricas de Éxito (KPIs)

| Métrica | Target Q2 2026 | Target Q4 2026 |
|---------|----------------|----------------|
| Tenants activos | 5 | 20 |
| MRR (Monthly Recurring Revenue) | $500 | $5,000 |
| GMV (Gross Merchandise Value) | $10,000 | $100,000 |
| Churn rate | <10% | <5% |
| NPS Score | >40 | >50 |
| Uptime | 99.9% | 99.95% |

---

## 9. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Data leak entre tenants | Baja | Crítico | RLS estricto + auditoría continua |
| Abuso por contenido ilegal | Media | Alto | Términos claros + moderación + reportes |
| Competencia (OnlyFans, etc.) | Alta | Medio | Diferenciación en UX + soporte local |
| Escalabilidad técnica | Media | Alto | Monitoreo early + arquitectura preparada |
| Dependencia de Convex/Vercel | Baja | Medio | Estrategia de backup + código portable |

---

## 10. Decisiones Pendientes

1. **Routing:** ¿Subdominios (karla-spice.zynch.fun) o paths (zynch.fun/karla-spice)?
2. **Self-service:** ¿Permitir registro público o solo por invitación de IWAI?
3. **Custom domains:** ¿Incluir en Pro o solo Enterprise?
4. **Comisiones:** ¿Porcentaje variable o flat fee?
5. **Equipo:** ¿Contratar developer adicional para Fase 3+?

---

## 12. Estrategia de Comunicación Segura (Zynch Connect) - [Marzo 2026]

Para garantizar la longevidad del negocio y proteger a los inquilinos de las políticas restrictivas de WhatsApp (Meta), se establece el sistema **"Zynch Connect"**.

### El Embudo de Comunicación:
1.  **Puerta de Enlace (WhatsApp):** Uso de WhatsApp únicamente para el primer contacto y marketing externo. Reducción de riesgo de baneo mediante mensajes cortos y derivación inmediata.
2.  **Migración de Tráfico:** Los inquilinos invitan al cliente a continuar en el **Chat Interno de Zynch** mediante incentivos (fotos 4K sin compresión, marcas de agua dinámicas, agendamiento seguro).
3.  **Chat Privado (Zynch App):** 
    *   **Independencia:** Si WhatsApp banea un número, la comunicación con el cliente sigue intacta en la plataforma.
    *   **Privacidad Elite:** Mensajes efímeros, bloqueo de capturas de pantalla y control total de la base de datos de contactos.
    *   **Fidelización:** El cliente permanece dentro del ecosistema Zynch, aumentando el MRR (Monthly Recurring Revenue).

### Valor Añadido por Plan:
*   **Plan Pro:** Gateway básico de WhatsApp.
*   **Plan Elite:** Acceso completo a **Zynch Connect**, envío de packs por chat y notificaciones push ilimitadas.

---

**Nota del Arquitecto:** El roadmap es el documento vivo que guía cada línea de código. Se revisa y actualiza en cada sesión para asegurar que la construcción del "edificio Zynch" sea coherente con la visión de negocio a largo plazo.

## 11. Decisiones Arquitectónicas Recientes (Marzo 2026)

### 11.1 Separación de Marketing y Producto
Se ha decidido formalmente separar la experiencia de usuario en dos entornos distintos para maximizar la conversión y la seguridad:
- **Marketing (Landing Page):** `www.zynch.app`. Enfocado en la captación, velocidad de carga (SEO) y presentación de beneficios/precios.
- **Producto (SaaS App):** `app.zynch.app`. Entorno dinámico y seguro donde reside la lógica de autenticación (Clerk/Convex), el dashboard del inquilino y la gestión de datos.

### 11.2 Rediseño de Navegación (Conversión)
Para alinear el landing page con los estándares de la industria SaaS (tipo Stripe/Vercel), se implementan cambios en la jerarquía visual de la barra de navegación:
- **Login (Acceso):** Link sutil tipo "Ingresar" para usuarios existentes, evitando ruido visual.
- **CTA Principal (Registro)::** Botón destacado "Crear Negocio" que redirige al flujo de onboarding en la aplicación.
- **Acceso Directo:** El botón del Hero se sincroniza con el CTA de la navegación para una experiencia consistente.

---

---

## 13. Automatización con GitHub Actions - [Pendiente #1]

Para escalar la "fábrica" de Zynch, se implementará un flujo de **CI/CD** (Integración y Despliegue Continuo):
- **Build & Test:** Validación automática del código en cada push.
- **Auto-Deploy:** Publicación automática en `admin.zynch.app` y `www.zynch.app`.
- **Mantenimiento:** Robots que revisan versiones y dependencias sin intervención manual.

## 14. Integración de Agent Skills (Cerebro IA) - [Pendiente #2]

Se adoptará el estándar de **Skills** (Habilidades especializadas) para optimizar el desarrollo de Antigravity sobre Zynch:
1.  `convex/best-practices`: Optimización de base de datos en tiempo real.
2.  `vercel/next-app-router`: Estructura moderna de SaaS.
3.  `tailwind/design-system`: DNA visual camaleónico.
4.  `github/actions-automation`: Inteligencia para el punto #13.
5.  `clerk/auth-security`: Integración profunda con el punto #15.
6.  `stripe/saas-billing`: Gestión de suscripciones y comisiones.
7.  `lucide/icon-orchestrator`: Interfaz fluida y ligera.
8.  `playwright/e2e-testing`: Pruebas de flujo completo de usuario.
9.  `n8n/automation-patterns`: Conectividad con WhatsApp/Telegram.
10. `next-seo/visibility`: Posicionamiento en Google.
11. `fastapi/ai-microservices`: Procesamiento de fotos con IA avanzada.

## 15. Seguridad y Acceso con Clerk - [Pendiente #3]

Implementación del sistema de **Auth** (Seguridad) de nivel bancario:
- **Costo Operativo:** $0 inicial (hasta 50k usuarios).
- **UX:** Acceso con 1-clic (Google, Apple, SMS).
- **Escalabilidad:** Separación total de datos entre inquilinos desde el inicio.

---

## 16. Estrategia Anti-Abuso Freemium - [COMPLETADO]

### **Regla de Oro: 1 WhatsApp = 1 Plan Gratis**
- **Identificador Principal**: Número de WhatsApp verificado por SMS
- **Device Fingerprinting**: Clerk proporciona ID único de dispositivo
- **Base de Datos Permanente**: Convex almacena identidad verificada

```typescript
// Schema en Convex:
users: {
  clerkId: string,        // ID único de Clerk
  telefono: string,       // WhatsApp verificado (único)
  deviceId: string,       // Dispositivo único (Clerk)
  email: string,          // Correo verificado
  planStatus: 'free' | 'pro' | 'elite' | 'enterprise',
  canCreateNewFree: boolean, // Reset solo con pago
  createdAt: timestamp
}
```

### **Niveles de Bloqueo**
1. **WhatsApp**: Si ya existe → "Upgrade required"
2. **Device ID**: Si ya usó free → "Solo upgrade disponible"
3. **Comportamiento**: Mismas fotos/horarios → sospecha

### **Flujo de Upgrade**
- Pago aprobado (Stripe) → `planStatus = 'pro'`
- Status cambiado → no puede volver a free
- Nuevo intento free → "Tu WhatsApp ya es Pro"

### **Estado Actual:**
- [x] ✅ Estrategia definida y documentada
- [x] ✅ Implementar schema en Convex
- [x] ✅ Crear validaciones de WhatsApp único
- [x] ✅ Integrar device fingerprinting (placeholder)
- [x] ✅ Tests de anti-abuso completados

---

## 17. Verificación de Identidad y Blindaje Legal - [NUEVO]

### **Verificación Obligatoria (Planes Pro/Elite)**
```typescript
// Schema en Convex:
tenantVerification: {
  tenantId: string,
  rif: string,              // OBLIGATORIO - Validar contra SENIAT
  cedulaFront: string,      // Foto frontal cédula
  cedulaBack: string,       // Foto trasera cédula
  selfieWithCedula: string, // Selfie con cédula en mano
  nombreLegal: string,      // Como aparece en documento
  verifiedAt: timestamp,
  status: 'pending' | 'approved' | 'rejected'
}
```

### **Contratos Digitales por Nivel**
- **Plan Pro ($60/mes)**: Contrato simple de exención de responsabilidad
- **Plan Elite ($95/mes)**: Términos detallados + políticas de contenido
- **Plan Enterprise**: Contrato legal completo con cláusulas de confidencialidad

### **Cláusulas Esenciales de Blindaje**
1. **Exención de Responsabilidad**: "Zynch es solo plataforma tecnológica"
2. **Términos de Contenido**: "Tenant es 100% responsable de su contenido"
3. **Protección de Marca**: "Uso no autorizado de marca Zynch prohibido"

---

## 18. Estrategia de Precios Enterprise - [DEFINIDA]

### **Planes por Cantidad de Tenants:**
- **🥉 Starter (3 Tenants)**: $80/mes - Mínimo 1 activo
- **🥈 Professional (6 Tenants)**: $140/mes - Ahorro $20
- **🥇 Premium (12 Tenants)**: $200/mes - Ahorro $40
- **➕ Extensiones (+12)**: $40 por tenant adicional

### **Reglas Clave:**
- **Logo obligatorio** para todos los tenants
- **Doble personalidad**: Nombre legal + Alias público
- **Máximo realista**: ~24 tenants (2 docenas)
- **Validación**: Mínimo 1 tenant activo para mantener cuenta

### **Schema Enterprise:**
```typescript
enterpriseAccounts: {
  adminId: v.id("users"),           // Usuario administrador
  companyName: v.string(),          // "Spice Entertainment Group"
  logoId: v.id("_storage"),        // Logo de la empresa
  planType: v.union(v.literal("starter"), v.literal("professional"), v.literal("premium")),
  registeredTenants: v.number(),    // Total registrados
  activeTenants: v.number(),       // Solo activos
  maxTenants: v.number(),          // 3, 6, o 12
  monthlyPrice: v.number(),        // $80, $140, $200
}
```

### **Estado Actual:**
- [x] ✅ Estrategia de precios definida
- [x] ✅ Schema de Enterprise diseñado
- [x] ✅ Reglas de doble personalidad establecidas
- [ ] Implementación pendiente (Fase 2)

---

## Conclusión

Zynch tiene una base técnica sólida (Convex multi-tenant, Next.js camaleónico). La profesionalización requiere:
1. **Seguridad:** ✅ RLS completo + Anti-Abuso Freemium implementado
2. **Producto:** ✅ Middleware de detección + Storage por tenant + Doble personalidad
3. **Negocio:** ✅ Modelo de precios Enterprise definido + Estrategia clara
4. **Automatización:** GitHub Actions + Agent Skills (pendiente)

**Progreso Fase 1: 90% completado** - Solo falta Vercel Edge Config

---

**Documento actualizado:** 2026-03-10  
**Cambios por:** Sesión estratégica completa (Alberto CEO + Cascade AI)  
**Logros:** RLS, Anti-Abuso, Storage, Middleware, Enterprise Pricing, Doble Personalidad

---

© 2026 **IWAI - Automated Processes** | [www.iwai.work](https://www.iwai.work)
