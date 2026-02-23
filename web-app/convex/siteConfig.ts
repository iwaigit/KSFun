import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Obtiene la configuración actual del sitio.
 * Retorna null si no hay ninguna configuración creada.
 */
export const get = query({
    args: {},
    handler: async (ctx) => {
        const config = await ctx.db.query("siteConfig").first();
        return config;
    },
});

/**
 * Actualiza la configuración del sitio o la crea si no existe.
 * Solo puede ser ejecutada por un admin (pendiente integración con roles).
 */
export const update = mutation({
    args: {
        performerName: v.string(),
        tagline: v.string(),
        profileImages: v.array(v.string()),
        primaryColor: v.string(),
        secondaryColor: v.string(),
        socialLinks: v.object({
            instagram: v.optional(v.string()),
            twitter: v.optional(v.string()),
            onlyfans: v.optional(v.string()),
            tiktok: v.optional(v.string()),
        }),
        contactEmail: v.string(),
        bio: v.string(),
        metaDescription: v.string(),

        // Nuevos campos
        locations: v.optional(v.array(v.string())),
        weight: v.optional(v.string()),
        schedule: v.optional(v.object({
            is24h: v.boolean(),
            from: v.optional(v.string()),
            to: v.optional(v.string()),
            workingDays: v.array(v.string()),
        })),
        pricing: v.optional(v.object({
            h1: v.number(),
            h2: v.optional(v.number()),
            night: v.optional(v.number()),
            customLabel: v.optional(v.string()),
            customPrice: v.optional(v.number()),
        })),
        vesRate: v.optional(v.number()),
        taxiIncluded: v.optional(v.boolean()),
        paymentMethods: v.optional(v.array(v.string())),
        services: v.optional(v.array(v.string())),
        targetAudience: v.optional(v.array(v.string())),
        activePromo: v.optional(v.object({
            label: v.string(),
            description: v.string(),
            isActive: v.boolean(),
        })),
        personalMessage: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("siteConfig").first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                ...args,
                updatedAt: Date.now(),
            });
            return existing._id;
        } else {
            return await ctx.db.insert("siteConfig", {
                ...args,
                updatedAt: Date.now(),
            });
        }
    },
});

/**
 * Inicializa la configuración con los datos de Karla Spice (Seed).
 */
export const initialize = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("siteConfig").first();
        if (existing) return existing._id;

        return await ctx.db.insert("siteConfig", {
            performerName: "Performer Name",
            tagline: "Official Site",
            profileImages: [
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?q=80&w=1000&auto=format&fit=crop"
            ],
            primaryColor: "#ff2d75", // Neon Pink
            secondaryColor: "#00f3ff", // Neon Cyan
            socialLinks: {
                instagram: "",
                twitter: "",
                onlyfans: "",
            },
            contactEmail: "contact@domain.fun",
            bio: "Official digital platform. Exclusive content, personalized experiences, and direct connection.",
            metaDescription: "Official Site - Exclusive Gallery, Content Packs and more.",
            locations: ["Caracas"],
            weight: "55kg",
            schedule: {
                is24h: true,
                workingDays: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
            },
            pricing: {
                h1: 100,
                h2: 180,
                night: 500
            },
            vesRate: 40, // Tasa de ejemplo
            taxiIncluded: false,
            paymentMethods: ["Ca$h", "Pago móvil", "Zelle"],
            services: ["Trato de Novia", "Cita Social"],
            targetAudience: ["Hombres"],
            activePromo: {
                label: "Promo Apertura",
                description: "1 Hora c/taxi incluido en zona céntrica",
                isActive: false
            },
            personalMessage: "¡Contáctame para una experiencia inolvidable!",
            updatedAt: Date.now(),
        });
    },
});
/**
 * Fuerza el reset de la configuración a los valores de marca blanca por defecto.
 */
export const resetToDefaults = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("siteConfig").first();
        const defaults = {
            performerName: "Performer Name",
            tagline: "Official Site",
            profileImages: [
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?q=80&w=1000&auto=format&fit=crop"
            ],
            primaryColor: "#ff2d75",
            secondaryColor: "#00f3ff",
            socialLinks: {
                instagram: "",
                twitter: "",
                onlyfans: "",
            },
            contactEmail: "contact@domain.fun",
            bio: "Official digital platform. Exclusive content, personalized experiences, and direct connection.",
            metaDescription: "Official Site - Exclusive Gallery, Content Packs and more.",
            locations: ["Caracas"],
            weight: "55kg",
            schedule: {
                is24h: true,
                workingDays: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
            },
            pricing: {
                h1: 100,
                h2: 180,
                night: 500
            },
            vesRate: 40,
            taxiIncluded: false,
            paymentMethods: ["Ca$h", "Pago móvil", "Zelle"],
            services: ["Trato de Novia", "Cita Social"],
            targetAudience: ["Hombres"],
            activePromo: {
                label: "Promo Apertura",
                description: "1 Hora c/taxi incluido en zona céntrica",
                isActive: false
            },
            personalMessage: "¡Contáctame para una experiencia inolvidable!",
            updatedAt: Date.now(),
        };

        if (existing) {
            await ctx.db.patch(existing._id, defaults);
            return existing._id;
        } else {
            return await ctx.db.insert("siteConfig", defaults);
        }
    },
});
