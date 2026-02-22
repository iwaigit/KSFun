# 🚀 Plan de Trabajo: KSFun Platform

> **Fecha:** 22 de Febrero, 2026  
> **Estado:** En desarrollo  
> **Colaboradores:** iwaigit + Agentes IA

---

## 📋 Resumen Ejecutivo

Transformar KSFun de una aplicación personalizada para Karla Spice a una **plataforma extensible multi-performer** que permita:

- Cambiar fácilmente la identidad del performer (Karla Spice → Melissa Bennet → Cualquiera)
- Gestionar datos del performer desde el dashboard admin
- Seleccionar diferentes templates/plantillas visuales
- Escalar a múltiples performers en el futuro

---

## 📁 Documentación del Proyecto

| Documento | Descripción | Enlace |
|-----------|-------------|--------|
| **CHANGELOG** | Registro de todos los cambios | [Ver](./CHANGELOG.md) |
| **FASE 1** | Sistema de Configuración Global | [Ver](./FASE_1.md) |
| **FASE 2** | Expansión del Perfil (próximamente) | - |
| **FASE 3** | Sistema Multi-Performer (futuro) | - |
| **FASE 4** | Templates Intercambiables (próximamente) | - |

---

## 🏗️ FASES DEL PROYECTO

### **FASE 1: Sistema de Configuración Global** 
*Base para hacer la app extensible*

| # | Tarea | Estado | Commit |
|---|-------|--------|--------|
| 1.1 | Crear tabla `config` en Convex con datos del performer | ⏳ Pendiente | - |
| 1.2 | Crear archivo `config/site.ts` con configuración centralizada | ⏳ Pendiente | - |
| 1.3 | Reemplazar textos "hardcodeados" de Karla por variables dinámicas | ⏳ Pendiente | - |
| 1.4 | Crear sistema de temas/colores personalizables | ⏳ Pendiente | - |

**📖 Detalles:** [FASE_1.md](./FASE_1.md)  
**Objetivo:** Cualquier cambio de branding (nombre, colores, logo) se hace desde UN solo lugar.

---

### **FASE 2: Expansión del Perfil de Usuario**
*Más datos y gestión en dashboard*

| # | Tarea | Estado | Commit |
|---|-------|--------|--------|
| 2.1 | Actualizar schema de `users` en Convex (bio, redes, foto, preferencias) | ⏳ Pendiente | - |
| 2.2 | Rediseñar página `/perfil` con más secciones | ⏳ Pendiente | - |
| 2.3 | Crear página `/admin/perfil` para editar datos del performer | ⏳ Pendiente | - |
| 2.4 | Sistema de avatar/foto de perfil con upload | ⏳ Pendiente | - |

**Objetivo:** El performer puede gestionar su información completa desde el admin.

---

### **FASE 3: Sistema Multi-Performer (Futuro)**
*Varias personas pueden usar la misma plataforma*

| # | Tarea | Estado | Commit |
|---|-------|--------|--------|
| 3.1 | Crear tabla `performers` en Convex | 🔮 Futuro | - |
| 3.2 | Subdominios o rutas dinámicas: `/[performer]/galeria` | 🔮 Futuro | - |
| 3.3 | Cada performer tiene su propia config, galería, productos | 🔮 Futuro | - |
| 3.4 | Sistema de autenticación por performer | 🔮 Futuro | - |

**Objetivo:** SaaS donde cualquiera puede registrarse y tener su propia página.

---

### **FASE 4: Templates/Plantillas Intercambiables**
*Cambiar el look & feel fácilmente*

| # | Tarea | Estado | Commit |
|---|-------|--------|--------|
| 4.1 | Crear templates base (Minimal, Bold, Elegant) | ⏳ Pendiente | - |
| 4.2 | Sistema de selección de template en admin | ⏳ Pendiente | - |
| 4.3 | Cada template tiene sus propios componentes/styles | ⏳ Pendiente | - |
| 4.4 | Preview en tiempo real antes de aplicar | ⏳ Pendiente | - |

**Objetivo:** Cambiar toda la apariencia de la web con un solo click.

---

## 📁 Estructura de Carpetas Propuesta

```
KSFun/
├── .docs/
│   └── roadmap/           # ← ESTE DOCUMENTO
│       ├── PLAN_GENERAL.md
│       ├── FASE_1.md
│       ├── FASE_2.md
│       ├── FASE_3.md
│       ├── FASE_4.md
│       └── CHANGELOG.md
├── web-app/
│   ├── config/
│   │   └── site.ts        # Configuración centralizada
│   ├── templates/
│   │   ├── minimal/
│   │   ├── bold/
│   │   └── elegant/
│   └── ...
└── ...
```

---

## 🔄 Flujo de Trabajo

1. **Planificación** → Documentar en `.docs/roadmap/`
2. **Desarrollo** → Hacer commits con referencia a la fase (ej: `[FASE-1] Add config table`)
3. **Revisión** → Actualizar este documento con el estado
4. **Documentación** → Registrar cambios en CHANGELOG.md

---

## ✅ Checklist General

- [ ] FASE 1 completada
- [ ] FASE 2 completada
- [ ] FASE 3 completada (futuro)
- [ ] FASE 4 completada
- [ ] Documentación actualizada
- [ ] Pruebas en local aprobadas
- [ ] Ready para producción

---

## 📝 Notas

- Prioridad: Completar FASE 1 y 2 antes de considerar FASE 3
- La FASE 3 es opcional y representa escalar a modelo SaaS
- Mantener compatibilidad hacia atrás con datos existentes

---

*Última actualización: 22/02/2026 por iwaigit*
