import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireTenantAccess, requireStaff } from "./permissions";

/**
 * Crear una nueva solicitud de cita
 */
export const create = mutation({
    args: {
        tenantId: v.id("tenants"),
        userId: v.id("users"),
        date: v.string(), // ISO String
        time: v.string(), // ej: "14:00"
        notes: v.optional(v.string()),
        requestingUserId: v.optional(v.id("users")), // TEMPORAL: hasta Clerk
    },
    handler: async (ctx, args) => {
        // RLS: Verificar acceso al tenant
        await requireTenantAccess(ctx, args.tenantId, args.requestingUserId);
        const existing = await ctx.db
            .query("appointments")
            .withIndex("by_tenant_date", (q) =>
                q.eq("tenantId", args.tenantId).eq("date", args.date)
            )
            .filter((q) => q.eq(q.field("time"), args.time))
            .first();

        if (existing) {
            throw new Error("Este horario ya no está disponible.");
        }

        const appointmentId = await ctx.db.insert("appointments", {
            tenantId: args.tenantId,
            userId: args.userId,
            date: args.date,
            time: args.time,
            status: "pending",
            notes: args.notes,
            createdAt: Date.now(),
        });

        return appointmentId;
    },
});

/**
 * Obtener citas de un usuario específico
 */
export const getByUser = query({
    args: {
        tenantId: v.id("tenants"),
        userId: v.id("users"),
        requestingUserId: v.optional(v.id("users")), // TEMPORAL: hasta Clerk
    },
    handler: async (ctx, args) => {
        // RLS: Verificar acceso al tenant
        await requireTenantAccess(ctx, args.tenantId, args.requestingUserId);
        
        return await ctx.db
            .query("appointments")
            .withIndex("by_tenant_user", (q) =>
                q.eq("tenantId", args.tenantId).eq("userId", args.userId)
            )
            .collect();
    },
});

/**
 * Obtener todas las citas de un inquilino (solo staff)
 */
export const getAll = query({
    args: { 
        tenantId: v.id("tenants"),
        requestingUserId: v.optional(v.id("users")), // TEMPORAL: hasta Clerk
    },
    handler: async (ctx, args) => {
        // RLS: Solo staff puede ver todas las citas
        await requireStaff(ctx, args.tenantId, args.requestingUserId);
        
        return await ctx.db
            .query("appointments")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .order("desc")
            .collect();
    },
});

/**
 * Actualizar estado de cita (solo staff)
 */
export const updateStatus = mutation({
    args: {
        id: v.id("appointments"),
        tenantId: v.id("tenants"),
        status: v.string(), // 'confirmed', 'rejected'
        requestingUserId: v.optional(v.id("users")), // TEMPORAL: hasta Clerk
    },
    handler: async (ctx, args) => {
        // RLS: Solo staff puede actualizar citas
        await requireStaff(ctx, args.tenantId, args.requestingUserId);
        const appointment = await ctx.db.get(args.id);
        if (!appointment || appointment.tenantId !== args.tenantId) {
            throw new Error("Unauthorized: Appointment not found or doesn't belong to this tenant.");
        }
        await ctx.db.patch(args.id, { status: args.status });
    },
});
