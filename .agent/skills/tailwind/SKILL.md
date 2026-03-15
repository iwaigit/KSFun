---
name: tailwind-design-system
description: Guía de estilo camaleónico y tokens visuales para temas dinámicos en Zynch.
---

# Zynch Skill: Chameleon Design System (Tailwind)

Zynch no tiene un solo estilo; se adapta a la identidad de cada cliente. Este skill define cómo lograr esa flexibilidad.

## 🎨 Temas Dinámicos (CSS Variables)

No uses colores estáticos de Tailwind (ej: `text-pink-500`) para elementos de marca. Usa variables cargadas desde la configuración del tenant.

### Configuración Oficial Zynch:

**Variables CSS (`:root`):**
```css
:root {
  --primary-zynch: #be2e57;
  --secondary-zynch: #9ead5c;
  --bg-dark: #312a30;
  --accent-sky: #9fd7fb;
  --deep-red: #840824;
  --text-muted: #a2bfcc;
}
```

**JSON Object:**
```json
{
  "zynch_palette": {
    "primary": "#be2e57",
    "secondary": "#9ead5c",
    "background": "#312a30",
    "accent": "#9fd7fb",
    "deep_red": "#840824",
    "text_muted": "#a2bfcc"
  }
}
```

**Tailwind Config Extension:**
```javascript
theme: {
  extend: {
    colors: {
      zynch: {
        primary: '#be2e57',
        secondary: '#9ead5c',
        dark: '#312a30',
        sky: '#9fd7fb',
        deep: '#840824',
        muted: '#a2bfcc',
      }
    }
  }
}
```

### Uso en Componentes:
```html
<button class="bg-[var(--primary)] hover:opacity-90 transition-all">
  Agendar Cita
</button>
```

## 📐 Layout & Responsive

1. **Mobile First**: Diseña siempre primero para móviles (donde la mayoría de los clientes acceden).
2. **Glassmorphism**: Aplica efectos de desenfoque (`backdrop-blur-md`) y bordes semitransparentes para un look premium/nocturno.
3. **Spacing**: Usa la escala estándar de Tailwind para mantener la armonía visual.

## 🎞️ Micro-Animaciones

Usa `framer-motion` o transiciones nativas de Tailwind para:
- Hovers en botones.
- Aparición suave de imágenes en la galería.
- El pulso de "En Vivo" o notificaciones.

---
*Cerebro Zynch v1.0*
