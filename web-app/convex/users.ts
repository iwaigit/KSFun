import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { requireAuth, requireTenantAccess, requireStaff } from "./permissions";
import { checkWhatsAppAvailability, checkDeviceAvailability, checkEmailAvailability } from "./antiAbuse";

/**
 * Registrar un nuevo prospecto (Lead)
 */
export const register = mutation({
    args: {
        tenantId: v.id("tenants"),
        email: v.string(),
        password: v.string(), // Temporal hasta Clerk
        birthdate: v.string(),
        phone: v.string(),
        userId: v.optional(v.id("users")), // TEMPORAL: hasta Clerk
        deviceId: v.string(), // Para anti-abuso
        planType: v.optional(v.string()), // 'free', 'pro', etc.
    },
    handler: async (ctx, args) => {
        // RLS: Verificar que el usuario tenga acceso al tenant
        await requireTenantAccess(ctx, args.tenantId, args.userId);
        
        // Anti-Abuse: Verificar disponibilidad si es plan free
        const planType = args.planType || "free";
        if (planType === "free") {
            await checkWhatsAppAvailability(ctx, args.phone);
            await checkDeviceAvailability(ctx, args.deviceId);
            await checkEmailAvailability(ctx, args.email);
        }
        
        const config = await ctx.db
            .query("siteConfig")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .unique(); // Usar .unique() para mayor seguridad

        const initials = config?.initials || "ZN";

        // Búsqueda eficiente usando el nuevo índice por tenant
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_tenant_role", (q) => q.eq("tenantId", args.tenantId))
            .filter((q) => q.eq(q.field("email"), args.email.toLowerCase()))
            .first();

        if (existingUser) {
            throw new Error("Este correo electrónico ya está registrado en este sitio.");
        }

        // Validación de edad
        const birthDate = new Date(args.birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) throw new Error("Debes tener al menos 18 años.");

        // Nota: El password se eliminará pronto a favor de Clerk
        const passwordRegex = new RegExp(`^${initials}\\d{5}$`);
        if (!passwordRegex.test(args.password.toUpperCase())) {
            throw new Error(`La clave debe ser ${initials} seguido de 5 números.`);
        }

        const userId = await ctx.db.insert("users", {
            tenantId: args.tenantId,
            email: args.email.toLowerCase(),
            password: args.password.toUpperCase(),
            birthdate: args.birthdate,
            phone: args.phone,
            isVerified: false,
            role: "client",
            createdAt: Date.now(),
        });

        // Anti-Abuse: Crear registro de control si es plan free
        if (planType === "free") {
            await ctx.db.insert("freePlanControls", {
                telefono: args.phone,
                deviceId: args.deviceId,
                email: args.email,
                tenantId: args.tenantId,
                planStatus: "free",
                canCreateNewFree: false,
                createdAt: Date.now(),
                lastActiveAt: Date.now(),
                suspiciousFlags: [],
            });
        }

        return userId;
    },
});

export const login = mutation({
    args: {
        tenantId: v.optional(v.id("tenants")),
        email: v.string(),
        password: v.string(),
        userId: v.optional(v.id("users")), // TEMPORAL: hasta Clerk
    },
    handler: async (ctx, args) => {
        // RLS: Si se especifica tenantId, verificar acceso
        if (args.tenantId) {
            await requireTenantAccess(ctx, args.tenantId, args.userId);
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
            .filter((q) => q.eq(q.field("tenantId"), args.tenantId))
            .first();

        if (!user || user.password !== args.password.toUpperCase()) {
            throw new Error("Credenciales inválidas.");
        }

        // Validación adicional de tenant (doble seguridad)
        if (args.tenantId && user.tenantId !== args.tenantId && user.role !== "admin") {
            throw new Error("No tienes acceso a este sitio.");
        }

        await ctx.db.insert("activityLogs", {
            tenantId: (user.tenantId || args.tenantId)! as Id<"tenants">,
            userId: user._id,
            action: "user_login",
            details: `Login: ${user.email}`,
            timestamp: Date.now(),
        });

        return {
            id: user._id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
            permissions: user.permissions
        };
    },
});

export const grantRole = mutation({
    args: {
        adminId: v.id("users"),
        targetUserId: v.id("users"),
        newRole: v.string(),
        permissions: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const admin = await ctx.db.get(args.adminId);
        if (!admin || (admin.role !== "admin" && admin.role !== "promoter")) {
            throw new Error("Acceso denegado.");
        }

        const targetUser = await ctx.db.get(args.targetUserId);
        if (!targetUser || (admin.role !== "admin" && targetUser.tenantId !== admin.tenantId)) {
            throw new Error("Unauthorized: Target user belongs to another tenant.");
        }

        await ctx.db.patch(args.targetUserId, {
            role: args.newRole,
            permissions: args.permissions || [],
        });

        if (targetUser.tenantId) {
            await ctx.db.insert("activityLogs", {
                tenantId: targetUser.tenantId,
                userId: args.targetUserId,
                action: "role_granted",
                details: `Nuevo rol: ${args.newRole}`,
                timestamp: Date.now(),
            });
        }

        return true;
    },
});

export const createAdminUser = mutation({
    args: {
        tenantId: v.optional(v.id("tenants")),
        email: v.string(),
        password: v.string(),
        birthdate: v.string(),
        phone: v.string(),
    },
    handler: async (ctx, args) => {
        const existingAdmin = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "admin"))
            .first();

        if (existingAdmin) throw new Error("El admin ya existe.");

        let initials = "ZN";
        if (args.tenantId) {
            const config = await ctx.db
                .query("siteConfig")
                .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
                .first();
            if (config?.initials) initials = config.initials;
        }

        if (!new RegExp(`^${initials}\\d{5}$`).test(args.password.toUpperCase())) {
            throw new Error("Formato de clave inválido.");
        }

        const adminId = await ctx.db.insert("users", {
            tenantId: args.tenantId,
            email: args.email,
            password: args.password.toUpperCase(),
            birthdate: args.birthdate,
            phone: args.phone,
            isVerified: true,
            role: "admin",
            permissions: ["full_access"],
            createdAt: Date.now(),
        });

        if (args.tenantId) {
            await ctx.db.insert("activityLogs", {
                tenantId: args.tenantId!,
                userId: adminId,
                action: "admin_created",
                details: `Admin inicial: ${args.email}`,
                timestamp: Date.now(),
            });
        }

        return adminId;
    },
});

export const getUserById = query({
    args: { userId: v.id("users"), tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user || user.tenantId !== args.tenantId) return null;
        return user;
    },
});

export const markUserAsVerified = mutation({
    args: { userId: v.id("users"), birthdate: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            isVerified: true,
            birthdate: args.birthdate
        });
        return true;
    },
});
