import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Usuarios con registro ZN+5números
    users: defineTable({
        email: v.string(),
        password: v.string(), // Formato: ZNXXXXX
        birthdate: v.string(),
        isVerified: v.boolean(),
        phone: v.optional(v.string()), // Formato internacional +XXXXX
        whatsappVerified: v.optional(v.boolean()),
        role: v.string(), // 'admin' (developer) | 'promoter' (business owner/performer) | 'vip' (premium client) | 'client' (standard)
        permissions: v.optional(v.array(v.string())), // e.g., ['view_logs', 'manage_calendar', 'grant_roles']
        createdAt: v.number(),
    }).index("by_email", ["email"])
        .index("by_phone", ["phone"]),

    // Sistema de Citas Profesional
    appointments: defineTable({
        userId: v.id("users"),
        date: v.string(),
        time: v.string(),
        status: v.string(), // 'pending', 'confirmed', 'rejected'
        notes: v.optional(v.string()),
        createdAt: v.number(),
    }).index("by_date", ["date"])
        .index("by_user", ["userId"]),

    // Tienda y Pedidos
    products: defineTable({
        name: v.string(),
        description: v.string(),
        priceUSD: v.number(),
        stock: v.optional(v.number()),
        category: v.string(),
        imageUrl: v.optional(v.string()),
        image: v.optional(v.string()),
        active: v.optional(v.boolean()),
        createdAt: v.optional(v.number()),
    }),

    orders: defineTable({
        userId: v.id("users"),
        items: v.array(v.object({
            id: v.string(),
            name: v.string(),
            priceUSD: v.number(),
            type: v.string(), // 'product' | 'pack'
        })),
        totalUSD: v.number(),
        status: v.string(), // 'pending', 'paid', 'shipped', 'completed', 'cancelled'
        createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // Control de Acceso Digital
    access: defineTable({
        userId: v.id("users"),
        packId: v.string(),
        grantedAt: v.number(),
    }).index("by_user_pack", ["userId", "packId"]),

    // Logs de Actividad (CRM)
    activityLogs: defineTable({
        userId: v.id("users"),
        action: v.string(), // e.g., 'login', 'purchase', 'appointment_booked', 'view_pack'
        details: v.string(),
        timestamp: v.number(),
    }).index("by_user", ["userId"]),

    settings: defineTable({
        key: v.string(),
        value: v.any(),
    }).index("by_key", ["key"]),

    // Galería de Fotos (Marketing) - Hasta 2 docenas de fotos
    gallery: defineTable({
        storageId: v.id("_storage"),
        alt: v.string(),
        order: v.number(),
        createdAt: v.number(),
    }).index("by_order", ["order"]),

    // Configuración Global del Sitio
    siteConfig: defineTable({
        performerName: v.string(),
        initials: v.optional(v.string()), // Added this field to store initials, defaulting to "ZN" if not set
        tagline: v.string(),
        profileImages: v.array(v.string()), // URLs externas (fallback/legacy)
        profileImageIds: v.optional(v.array(v.id("_storage"))), // Convex Storage IDs
        primaryColor: v.string(),
        secondaryColor: v.string(),
        backgroundColor: v.optional(v.string()), // Color de fondo del sitio
        socialLinks: v.object({
            instagram: v.optional(v.string()),
            twitter: v.optional(v.string()),
            onlyfans: v.optional(v.string()),
            tiktok: v.optional(v.string()),
        }),
        contactEmail: v.string(),
        bio: v.string(),
        metaDescription: v.string(),

        // --- Físico del Perfil ---
        height: v.optional(v.string()),       // Estatura ej: "1.68m"
        eyeColor: v.optional(v.string()),     // Color de ojos ej: "Café"
        locations: v.optional(v.array(v.string())),
        weight: v.optional(v.string()),

        // --- Stats Dinámicas (Barras de Rendimiento) ---
        stats: v.optional(v.array(v.object({
            label: v.string(),   // Encanto, Estilo, etc.
            value: v.number(),   // 0-100
            color: v.string(),   // Color hex ej: "#ff2d75"
        }))),

        // --- Horario & Servicio ---
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

        updatedAt: v.number(),
    }),
});
