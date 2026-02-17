import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrder = mutation({
    args: {
        userId: v.id("users"),
        items: v.array(v.object({
            id: v.string(),
            name: v.string(),
            priceUSD: v.number(),
            type: v.string(),
        })),
        totalUSD: v.number(),
    },
    handler: async (ctx, args) => {
        const orderId = await ctx.db.insert("orders", {
            userId: args.userId,
            items: args.items,
            totalUSD: args.totalUSD,
            status: "pending",
            createdAt: Date.now(),
        });

        // Log de Actividad
        await ctx.db.insert("activityLogs", {
            userId: args.userId,
            action: "purchase_initiated",
            details: `Pedido ${orderId.toString()} iniciado por $${args.totalUSD}`,
            timestamp: Date.now(),
        });

        // Si hay packs, registrar acceso (esto debería ser tras el pago, pero lo dejamos preparado)
        for (const item of args.items) {
            if (item.type === 'pack') {
                await ctx.db.insert("activityLogs", {
                    userId: args.userId,
                    action: "pack_purchase_intent",
                    details: `Intento de compra de Pack: ${item.name}`,
                    timestamp: Date.now(),
                });
            }
        }

        return orderId;
    },
});

export const listAll = query({
    handler: async (ctx) => {
        const orders = await ctx.db.query("orders").order("desc").collect();
        return Promise.all(orders.map(async (order) => {
            const user = await ctx.db.get(order.userId);
            return { ...order, userName: user?.email };
        }));
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("orders"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.id);
        if (!order) throw new Error("Order not found");

        await ctx.db.patch(args.id, { status: args.status });

        // Si el estado es 'completed', otorgar acceso a los packs
        if (args.status === 'completed') {
            for (const item of order.items) {
                if (item.type === 'pack') {
                    await ctx.db.insert("access", {
                        userId: order.userId,
                        packId: item.id,
                        grantedAt: Date.now(),
                    });
                }
            }
        }

        await ctx.db.insert("activityLogs", {
            userId: order.userId,
            action: `order_${args.status}`,
            details: `Estado del pedido ${args.id} actualizado a ${args.status}`,
            timestamp: Date.now(),
        });
    },
});
