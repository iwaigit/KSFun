import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Role Definitions:
 * - admin: Developer with full dashboard access and ability to grant all roles
 * - promoter: Business owner (Karla Spice) with access to client logs and calendar management
 * - vip: Premium client with special content access
 * - client: Standard registered user
 */

// Check if user has admin role
export const isAdmin = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        return user?.role === "admin";
    },
});

// Check if user has promoter role
export const isPromoter = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        return user?.role === "promoter";
    },
});

// Check if user has admin OR promoter role (for shared permissions)
export const isStaff = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        return user?.role === "admin" || user?.role === "promoter";
    },
});

// Check if user has specific permission
export const hasPermission = query({
    args: {
        userId: v.id("users"),
        permission: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return false;

        // Admin has all permissions
        if (user.role === "admin") return true;

        // Check explicit permissions array
        return user.permissions?.includes(args.permission) ?? false;
    },
});
