import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Obtener todos los productos
export const getActive = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("products")
            .filter((q) => q.eq(q.field("active"), true))
            .collect();
    },
});

// Crear un nuevo producto (Para el panel de admin que crearemos después)
export const create = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        priceUSD: v.number(),
        category: v.string(), // 'lenceria', 'toys', 'digital'
        image: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("products", {
            ...args,
            active: true,
            createdAt: Date.now(),
        });
    },
});

// Registrar un pedido (Checkout)
export const createOrder = mutation({
    args: {
        userId: v.id("users"),
        productId: v.id("products"),
        paymentMethod: v.string(), // 'paypal', 'cash', 'ves'
        total: v.number(),
        currency: v.string(), // 'USD', 'VES'
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("orders", {
            ...args,
            status: "pending",
            createdAt: Date.now(),
        });
    },
});
