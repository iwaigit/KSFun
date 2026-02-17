import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear una nueva solicitud de cita
export const create = mutation({
    args: {
        userId: v.id("users"),
        date: v.string(), // ISO String
        time: v.string(), // ej: "14:00"
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Verificar si el slot ya está ocupado (opcional para simplicidad inicial)
        const existing = await ctx.db
            .query("appointments")
            .withIndex("by_date", (q) => q.eq("date", args.date))
            .filter((q) => q.eq(q.field("time"), args.time))
            .unique();

        if (existing) {
            throw new Error("Este horario ya no está disponible.");
        }

        const appointmentId = await ctx.db.insert("appointments", {
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

// Obtener citas de un usuario específico
export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("appointments")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();
    },
});

// Obtener todas las citas para el Panel de Admin de Karla
export const getAll = query({
    handler: async (ctx) => {
        return await ctx.db.query("appointments").order("desc").collect();
    },
});

// Actualizar estado de cita (Aprobar/Rechazar)
export const updateStatus = mutation({
    args: {
        id: v.id("appointments"),
        status: v.string(), // 'confirmed', 'rejected'
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});
