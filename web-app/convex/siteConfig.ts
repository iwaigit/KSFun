import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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
 * Genera una URL de subida para las fotos de perfil en Convex Storage.
 */
export const generateProfileImageUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

/**
 * Guarda el storageId de una foto de perfil en la posición indicada (0 o 1).
 * Elimina la imagen anterior si existía en storage.
 */
export const saveProfileImage = mutation({
    args: {
        storageId: v.id("_storage"),
        index: v.number(), // 0 = primera, 1 = segunda
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("siteConfig").first();
        if (!existing) throw new Error("siteConfig no existe. Inicializa primero.");

        const currentIds: (Id<"_storage"> | null)[] = [
            ...(existing.profileImageIds || [null, null]),
        ];

        // Eliminar imagen anterior de storage si existe
        const oldId = currentIds[args.index];
        if (oldId) {
            try { await ctx.storage.delete(oldId); } catch { /* ignorar si ya fue eliminada */ }
        }

        // Insertar nueva ID en la posición correcta
        while (currentIds.length <= args.index) currentIds.push(null);
        currentIds[args.index] = args.storageId;

        await ctx.db.patch(existing._id, {
            profileImageIds: currentIds.filter((id): id is Id<"_storage"> => id !== null),
            updatedAt: Date.now(),
        });
    },
});

/**
 * Elimina una foto de perfil del storage y limpia su ID del siteConfig.
 */
export const deleteProfileImage = mutation({
    args: { index: v.number() },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("siteConfig").first();
        if (!existing) return;

        const currentIds = [...(existing.profileImageIds || [])];
        const idToDelete = currentIds[args.index];
        if (idToDelete) {
            try { await ctx.storage.delete(idToDelete); } catch { /* ignorar */ }
            currentIds.splice(args.index, 1);
            await ctx.db.patch(existing._id, {
                profileImageIds: currentIds,
                updatedAt: Date.now(),
            });
        }
    },
});

/**
 * Obtiene la configuración actual del sitio.
 * Resuelve los storageIds de fotos de perfil a URLs públicas.
 */
export const get = query({
    args: {},
    handler: async (ctx) => {
        const config = await ctx.db.query("siteConfig").first();
        if (!config) return null;

        // Resolver IDs de storage a URLs públicas
        let resolvedProfileImages = [...(config.profileImages || [])];
        if (config.profileImageIds && config.profileImageIds.length > 0) {
            const storageUrls = await Promise.all(
                config.profileImageIds.map(id => ctx.storage.getUrl(id))
            );
            // Las fotos de storage tienen prioridad sobre las URLs externas
            resolvedProfileImages = storageUrls.filter((url): url is string => url !== null);
        }

        return {
            ...config,
            profileImages: resolvedProfileImages,
        };
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
 * Inicializa con valores por defecto si no existe. (Seed)
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
 * Resetea todo a los valores de marca blanca.
 * TAMBIÉN elimina las fotos de perfil del storage.
 */
export const resetToDefaults = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("siteConfig").first();
        const defaults = { ...getDefaults(), profileImageIds: undefined };

        // Eliminar fotos de storage si existían
        if (existing?.profileImageIds) {
            await Promise.all(
                existing.profileImageIds.map(id =>
                    ctx.storage.delete(id).catch(() => { /* ignorar */ })
                )
            );
        }

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
        socialLinks: { instagram: "", twitter: "", onlyfans: "", tiktok: "" },
        contactEmail: "contact@domain.fun",
        bio: "Official digital platform. Exclusive content, personalized experiences, and direct connection.",
        metaDescription: "Official Site - Exclusive Gallery, Content Packs and more.",
        height: "1.68m",
        eyeColor: "Café",
        locations: ["Caracas"],
        weight: "55kg",
        stats: DEFAULT_STATS,
        schedule: { is24h: true, workingDays: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"] },
        pricing: { h1: 100, h2: 180, night: 500 },
        vesRate: 40,
        taxiIncluded: false,
        paymentMethods: ["Ca$h", "Pago móvil", "Zelle"],
        services: ["Trato de Novia", "Cita Social", "Masajes Relajantes"],
        targetAudience: ["Hombres"],
        activePromo: { label: "Promo Apertura", description: "1 Hora c/taxi incluido en zona céntrica", isActive: false },
        personalMessage: "¡Contáctame para una experiencia inolvidable!",
        updatedAt: Date.now(),
    };
}
