import { query } from "./_generated/server";
import { v } from "convex/values";

// List all activity logs (for promoter/admin)
export const listAll = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("activityLogs")
            .order("desc")
            .take(100);
    },
});

// List logs for specific user
export const listByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("activityLogs")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(50);
    },
});
