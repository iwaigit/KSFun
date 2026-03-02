import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Obtener todos los productos activos de un inquilino
 */
export const getActive = query({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("products")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .filter((q) => q.eq(q.field("active"), true))
            .collect();
    },
});

/**
 * Obtener un producto por ID con validación de inquilino
 */
export const getById = query({
    args: { productId: v.id("products"), tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const product = await ctx.db.get(args.productId);
        if (!product || product.tenantId !== args.tenantId) return null;
        return product;
    },
});

/**
 * Crear un nuevo producto
 */
export const create = mutation({
    args: {
        tenantId: v.id("tenants"),
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