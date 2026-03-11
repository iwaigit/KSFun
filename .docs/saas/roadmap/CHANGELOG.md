# 📋 CHANGELOG - Zynch by iwai Platform

> Registro de cambios y avances del proyecto

---

## Formato

```
## [FASE-X] Título del cambio - YYYY-MM-DD

### Agregado
- Nueva funcionalidad X
- Nueva funcionalidad Y

### Modificado
- Cambio en Z

### Corregido
- Bug en W

### Commit: `hash`
```

---

## [FASE-0] Setup inicial del proyecto - 2026-02-17

### Agregado
- Proyecto Next.js con TypeScript
- Integración con Convex (backend)
- Sistema de autenticación básico
- Páginas: admin, galería, perfil, verificar-edad
- Componentes: Gallery, Shop, RegisterForm, etc.

### Commit inicial
`a7467ca` - Initial commit for Zynch by iwai (Alpha phase)

---

## [FASE-0] Debug y reportes - 2026-02-20

### Agregado
- Sistema de logging en AuthContext
- Página de test para Convex
- Reporte de bug: PRODUCTION_VERIFICATION_BUG_REPORT.md

### Commit
`a4f4b49` - Add extensive logging to AuthContext

---

## [PLAN] Creación de roadmap de desarrollo - 2026-02-22

### Agregado
- PLAN_GENERAL.md con las 4 fases del proyecto
- CHANGELOG.md para seguimiento de cambios
- Estructura de carpetas `.docs/roadmap/`

### Commit
`39e101f` - docs: Add general development roadmap

## [FASE-0] Despliegue de Landing Page yDominio - 2026-03-10

### Agregado
- Landing page oficial en `zynch-landing/` desplegada.
- Configuración de dominio `zynch.app` en Porkbun.
- Registros DNS (A, CNAME) apuntando a GitHub Pages.
- SSL/HTTPS activado y forzado.

### Modificado
- `landing-deploy.yml`: Corregido para desplegar la carpeta de la landing en lugar de un placeholder.

### Commit
`fa1bb43` - Fix: Configure landing page deployment

---

## Próximos cambios esperados

- [FASE-1] Crear tabla `config` en Convex
- [FASE-1] Configuración centralizada del sitio
- [FASE-2] Expansión del perfil de usuario

## [ESTRATEGIA] Ajuste de Roadmap y Fecha de Lanzamiento - 2026-03-11

### Modificado
- `PLAN_GENERAL.md`: Se ajustó la fecha de lanzamiento a un estimado realista (**30 de Julio, 2026**) basado en la complejidad del sistema multi-tenant y la capacidad de un solo desarrollador.
- `index.html` (Landing): Se fijó el contador para el lanzamiento oficial.

### Análisis
- El backend (`convex/schema.ts`) está avanzado al 85% para multi-tenancy.
- El foco principal ahora es la integración del frontend con subdominios y el flujo de onboarding.

---

*Mantenido por: iwaigit*
