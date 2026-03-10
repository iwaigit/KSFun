import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Verificar si un teléfono WhatsApp ya tiene un plan free
 * @throws Error si ya existe un plan free para este teléfono
 */
export async function checkWhatsAppAvailability(
    ctx: QueryCtx | MutationCtx,
    telefono: string
) {
    const existing = await ctx.db
        .query("freePlanControls")
        .withIndex("by_telefono", q => q.eq("telefono", telefono))
        .first();

    if (existing && existing.planStatus === "free") {
        throw new Error(
            "Este WhatsApp ya tiene una cuenta gratuita. " +
            "Para continuar, actualiza al plan Pro o usa un número diferente."
        );
    }

    return existing; // Puede ser null o un usuario con plan pago
}

/**
 * Verificar si un dispositivo ya usó un plan free
 * @throws Error si el dispositivo ya tuvo un plan free
 */
export async function checkDeviceAvailability(
    ctx: QueryCtx | MutationCtx,
    deviceId: string
) {
    const existing = await ctx.db
        .query("freePlanControls")
        .withIndex("by_device", q => q.eq("deviceId", deviceId))
        .first();

    if (existing && existing.planStatus === "free") {
        throw new Error(
            "Este dispositivo ya utilizó una cuenta gratuita. " +
            "Solo puedes tener una cuenta gratuita por dispositivo. " +
            "Actualiza a Pro para crear más cuentas."
        );
    }

    return existing;
}

/**
 * Verificar si un email ya está en uso
 * @throws Error si el email ya existe con plan free
 */
export async function checkEmailAvailability(
    ctx: QueryCtx | MutationCtx,
    email: string
) {
    const existing = await ctx.db
        .query("freePlanControls")
        .withIndex("by_email", q => q.eq("email", email))
        .first();

    if (existing && existing.planStatus === "free") {
        throw new Error(
            "Este email ya tiene una cuenta gratuita. " +
            "Usa un email diferente o actualiza tu plan actual."
        );
    }

    return existing;
}

/**
 * Crear registro de control para plan free
 */
export const createFreePlanControl = mutation({
    args: {
        telefono: v.string(),
        deviceId: v.string(),
        email: v.string(),
        tenantId: v.id("tenants"),
    },
    handler: async (ctx, args) => {
        // Verificar disponibilidad antes de crear
        await checkWhatsAppAvailability(ctx, args.telefono);
        await checkDeviceAvailability(ctx, args.deviceId);
        await checkEmailAvailability(ctx, args.email);

        // Crear registro de control
        const controlId = await ctx.db.insert("freePlanControls", {
            telefono: args.telefono,
            deviceId: args.deviceId,
            email: args.email,
            tenantId: args.tenantId,
            planStatus: "free",
            canCreateNewFree: false, // Nunca puede crear otro free
            createdAt: Date.now(),
            lastActiveAt: Date.now(),
            suspiciousFlags: [],
        });

        return controlId;
    },
});

/**
 * Actualizar estado del plan (cuando un usuario paga)
 */
export const upgradePlanStatus = mutation({
    args: {
        telefono: v.string(),
        newPlan: v.union(v.literal("pro"), v.literal("elite"), v.literal("enterprise")),
        tenantId: v.id("tenants"),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("freePlanControls")
            .withIndex("by_telefono", q => q.eq("telefono", args.telefono))
            .first();

        if (!existing) {
            throw new Error("No se encontró registro de control para este teléfono");
        }

        // Actualizar estado
        await ctx.db.patch(existing._id, {
            planStatus: args.newPlan,
            lastActiveAt: Date.now(),
        });

        // Actualizar también en tabla de tenants
        await ctx.db.patch(args.tenantId, {
            planType: args.newPlan,
        });

        return existing._id;
    },
});

/**
 * Verificar si un usuario puede crear cuenta free
 */
export const canCreateFreeAccount = query({
    args: {
        telefono: v.string(),
        deviceId: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            // Verificar teléfono
            await checkWhatsAppAvailability(ctx, args.telefono);
            
            // Verificar dispositivo
            await checkDeviceAvailability(ctx, args.deviceId);
            
            // Verificar email
            await checkEmailAvailability(ctx, args.email);
            
            return {
                canCreate: true,
                reason: "All checks passed"
            };
            
        } catch (error: any) {
            return {
                canCreate: false,
                reason: error.message || "Unknown error occurred"
            };
        }
    },
});

/**
 * Agregar bandera de sospecha a una cuenta
 */
export const addSuspiciousFlag = mutation({
    args: {
        telefono: v.string(),
        flag: v.string(), // "duplicate_photos", "same_schedule", "suspicious_activity"
        requestingUserId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("freePlanControls")
            .withIndex("by_telefono", q => q.eq("telefono", args.telefono))
            .first();

        if (!existing) {
            throw new Error("No se encontró registro para este teléfono");
        }

        // Agregar bandera si no existe
        const flags = existing.suspiciousFlags || [];
        if (!flags.includes(args.flag)) {
            flags.push(args.flag);
        }

        await ctx.db.patch(existing._id, {
            suspiciousFlags: flags,
            lastActiveAt: Date.now(),
        });

        return existing._id;
    },
});

/**
 * Obtener todos los registros sospechosos (solo admin)
 */
export const getSuspiciousAccounts = query({
    args: {
        requestingUserId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        // TODO: Agregar verificación de admin cuando tengamos auth
        // await requireAdmin(ctx, args.requestingUserId);
        
        return await ctx.db
            .query("freePlanControls")
            .filter(q => 
                q.and(
                    q.gt(q.field("suspiciousFlags"), 0), // Tiene banderas
                    q.eq(q.field("planStatus"), "free")   // Sigue en plan free
                )
            )
            .collect();
    },
});
