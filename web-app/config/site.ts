/**
 * Configuración estática por defecto del sitio.
 * Estos valores se usan como fallback mientras carga Convex
 * o si no hay datos en la BD.
 */
export const siteConfig = {
    name: "Zynch by iwai",
    tagline: "Premium Personal Service Platform",
    description: "Zynch by iwai is a professional digital platform for personal services. Exclusive content, automated appointment management, and direct connection.",
    bio: "Zynch by iwai is a professional digital platform for personal services. Exclusive content, automated appointment management, and direct connection.",
    links: {
        instagram: "",
        twitter: "",
        onlyfans: "",
        tiktok: "",
    },
    email: "contact@iwai.work",
    colors: {
        primary: "#ff2d75",   // Neon Pink
        secondary: "#00f3ff", // Neon Cyan
        background: "#0a0a0a",
    }
};

export type SiteConfig = typeof siteConfig;
