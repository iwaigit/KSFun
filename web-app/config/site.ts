/**
 * Configuración estática por defecto del sitio.
 * Estos valores se usan como fallback mientras carga Convex
 * o si no hay datos en la BD.
 */
export const siteConfig = {
    name: "Zynch.app",
    tagline: "Gestión Profesional y Citas para Performers",
    description: "Zynch.app: La plataforma camaleónica para gestionar tus citas, vender packs virtuales y proteger tu marca personal con total discreción y seguridad IA.",
    keywords: ["Zynch", "iwai", "gestión de citas", "performers", "marca blanca", "packs virtuales", "agenda segura", "multi-tenant saas"],
    bio: "Zynch.app is a professional digital platform for personal services. Exclusive content, automated appointment management, and direct connection.",
    links: {
        instagram: "",
        twitter: "",
        onlyfans: "",
        tiktok: "",
    },
    email: "contact@iwai.work",
    colors: {
        primary: "#be2e57",   // Zynch Pink/Red
        secondary: "#9ead5c", // Zynch Green
        background: "#312a30",
    }
};

export type SiteConfig = typeof siteConfig;
