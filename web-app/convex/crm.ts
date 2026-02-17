import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateUserRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.string(),
        permissions: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            role: args.role,
            permissions: args.permissions || [],
        });
    },
});

export const listClients = query({
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        return Promise.all(users.map(async (user) => {
            const ordersCount = (await ctx.db
                .query("orders")
                .withIndex("by_user", (q) => q.eq("userId", user._id))
                .collect()).length;

            const lastActivity = await ctx.db
                .query("activityLogs")
                .withIndex("by_user", (q) => q.eq("userId", user._id))
                .order("desc")
                .first();

            return {
                ...user,
                ordersCount,
                lastActivity: lastActivity?.action || 'Sin actividad',
            };
        }));
    },
});

export const getClientDetails = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return null;

        const orders = await ctx.db
            .query("orders")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        const appointments = await ctx.db
            .query("appointments")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        const logs = await ctx.db
            .query("activityLogs")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        const access = await ctx.db
            .query("access")
            .withIndex("by_user_pack", (q) => q.eq("userId", args.userId))
            .collect();

        return {
            user,
            orders,
            appointments,
            logs,
            access
        };
    },
});
