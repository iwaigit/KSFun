import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const statSchema = v.object({
    label: v.string(),
    value: v.number(),
    color: v.string(),
});

const DEFAULT_STATS = [
    { label: "Encanto", value: 95, color: "#ff2d75" },
    { label: "Estilo", value: 98, color: "#00f3ff" },
    { label: "Energía", value: 92, color: "#fff300" },
    { label: "Misterio", value: 88, color: "#bd00ff" },
];

/**
 * Obtiene la configuración actual del sitio.
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
 */
export const update = mutation({
    args: {
        performerName: v.string(),
        tagline: v.string(),
        profileImages: v.array(v.string()),
        primaryColor: v.string(),
        secondaryColor: v.string(),
        backgroundColor: v.optional(v.string()),
        socialLinks: v.object({
            instagram: v.optional(v.string()),
            twitter: v.optional(v.string()),
            onlyfans: v.optional(v.string()),
            tiktok: v.optional(v.string()),
        }),
        contactEmail: v.string(),
        bio: v.string(),
        metaDescription: v.string(),

        // Físico
        height: v.optional(v.string()),
        eyeColor: v.optional(v.string()),
        locations: v.optional(v.array(v.string())),
        weight: v.optional(v.string()),

        // Stats dinámicas
        stats: v.optional(v.array(statSchema)),

        // Servicio
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
            await ctx.db.patch(existing._id, { ...args, updatedAt: Date.now() });
            return existing._id;
        } else {
            return await ctx.db.insert("siteConfig", { ...args, updatedAt: Date.now() });
        }
    },
});

/**
 * Inicializa la configuración con datos por defecto (Seed).
 * Solo crea si no existe.
 */
export const initialize = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("siteConfig").first();
        if (existing) return existing._id;
        return await ctx.db.insert("siteConfig", getDefaults());
    },
});

/**
 * Fuerza el reset al estado por defecto (marca blanca).
 */
export const resetToDefaults = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("siteConfig").first();
        const defaults = getDefaults();
        if (existing) {
            await ctx.db.patch(existing._id, defaults);
            return existing._id;
        } else {
            return await ctx.db.insert("siteConfig", defaults);
        }
    },
});

function getDefaults() {
    return {
        performerName: "Performer Name",
        tagline: "Official Site",
        profileImages: [
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop"
        ],
        primaryColor: "#ff2d75",
        secondaryColor: "#00f3ff",
        backgroundColor: "#0d0d12",
        socialLinks: {
            instagram: "",
            twitter: "",
            onlyfans: "",
            tiktok: "",
        },
        contactEmail: "contact@domain.fun",
        bio: "Official digital platform. Exclusive content, personalized experiences, and direct connection.",
        metaDescription: "Official Site - Exclusive Gallery, Content Packs and more.",
        height: "1.68m",
        eyeColor: "Café",
        locations: ["Caracas"],
        weight: "55kg",
        stats: DEFAULT_STATS,
        schedule: {
            is24h: true,
            workingDays: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
        },
        pricing: { h1: 100, h2: 180, night: 500 },
        vesRate: 40,
        taxiIncluded: false,
        paymentMethods: ["Ca$h", "Pago móvil", "Zelle"],
        services: ["Trato de Novia", "Cita Social", "Masajes Relajantes"],
        targetAudience: ["Hombres"],
        activePromo: {
            label: "Promo Apertura",
            description: "1 Hora c/taxi incluido en zona céntrica",
            isActive: false,
        },
        personalMessage: "¡Contáctame para una experiencia inolvidable!",
        updatedAt: Date.now(),
    };
}
