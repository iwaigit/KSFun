import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { requireTenantAccess } from "./permissions";

/**
 * Generar ruta de storage para un tenant específico
 * Formato: tenants/{tenantId}/{type}/{filename}
 */
export function generateStoragePath(tenantId: string, type: string, filename: string): string {
    // Sanitizar filename
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `tenants/${tenantId}/${type}/${cleanFilename}`;
}

/**
 * Subir archivo con validación de tenant
 */
export const uploadFile = mutation({
    args: {
        tenantId: v.id("tenants"),
        file: v.string(), // Storage ID como string temporalmente
        type: v.string(), // 'gallery', 'profile', 'cedula_front', 'cedula_back', 'selfie'
        filename: v.string(),
        requestingUserId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        // RLS: Verificar acceso al tenant
        await requireTenantAccess(ctx, args.tenantId, args.requestingUserId);
        
        // Generar ruta única
        const storagePath = generateStoragePath(args.tenantId, args.type, args.filename);
        
        // Crear registro de storage con metadata
        const storageId = await ctx.db.insert("storageFiles", {
            tenantId: args.tenantId,
            originalFileId: args.file as any, // Cast temporal
            storagePath,
            type: args.type,
            filename: args.filename,
            uploadedAt: Date.now(),
            uploadedBy: args.requestingUserId,
        });
        
        // Obtener URL del archivo
        const originalUrl = await ctx.storage.getUrl(args.file as any);
        
        return {
            storageId,
            storagePath,
            originalUrl: originalUrl || null,
        };
    },
});

/**
 * Obtener URL de archivo con validación de tenant
 */
export const getFileUrl = query({
    args: {
        tenantId: v.id("tenants"),
        storageId: v.id("storageFiles"),
        requestingUserId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        // RLS: Verificar acceso al tenant
        await requireTenantAccess(ctx, args.tenantId, args.requestingUserId);
        
        // Obtener registro de storage
        const storageRecord = await ctx.db.get(args.storageId);
        if (!storageRecord) {
            throw new Error("Archivo no encontrado");
        }
        
        // Validar que pertenezca al tenant
        if (storageRecord.tenantId !== args.tenantId) {
            throw new Error("No tienes acceso a este archivo");
        }
        
        // Obtener URL del archivo original
        const url = await ctx.storage.getUrl(storageRecord.originalFileId as any);
        
        return {
            url: url || null,
            filename: storageRecord.filename,
            type: storageRecord.type,
            uploadedAt: storageRecord.uploadedAt,
        };
    },
});

/**
 * Listar archivos de un tenant por tipo
 */
export const listFilesByType = query({
    args: {
        tenantId: v.id("tenants"),
        type: v.string(), // 'gallery', 'profile', etc.
        requestingUserId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        // RLS: Verificar acceso al tenant
        await requireTenantAccess(ctx, args.tenantId, args.requestingUserId);
        
        // Obtener todos los archivos del tenant (filtrar por tipo manualmente)
        const allFiles = await ctx.db
            .query("storageFiles")
            .withIndex("by_tenant", q => q.eq("tenantId", args.tenantId))
            .collect();
        
        // Filtrar por tipo
        const files = allFiles.filter(file => file.type === args.type);
        
        // Obtener URLs para todos los archivos
        const filesWithUrls = await Promise.all(
            files.map(async (file) => {
                const url = await ctx.storage.getUrl(file.originalFileId as any);
                return {
                    ...file,
                    url: url || null,
                };
            })
        );
        
        return filesWithUrls;
    },
});

/**
 * Eliminar archivo con validación
 */
export const deleteFile = mutation({
    args: {
        tenantId: v.id("tenants"),
        storageId: v.id("storageFiles"),
        requestingUserId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        // RLS: Verificar acceso al tenant
        await requireTenantAccess(ctx, args.tenantId, args.requestingUserId);
        
        // Obtener registro de storage
        const storageRecord = await ctx.db.get(args.storageId);
        if (!storageRecord) {
            throw new Error("Archivo no encontrado");
        }
        
        // Validar que pertenezca al tenant
        if (storageRecord.tenantId !== args.tenantId) {
            throw new Error("No tienes acceso a este archivo");
        }
        
        // Eliminar archivo original de Convex Storage
        await ctx.storage.delete(storageRecord.originalFileId as any);
        
        // Eliminar registro de storage
        await ctx.db.delete(args.storageId);
        
        return { success: true };
    },
});

/**
 * Subir imagen de perfil con watermark automático
 */
export const uploadProfileImage = mutation({
    args: {
        tenantId: v.id("tenants"),
        file: v.string(), // Storage ID
        filename: v.string(),
        requestingUserId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        // RLS: Verificar acceso al tenant
        await requireTenantAccess(ctx, args.tenantId, args.requestingUserId);
        
        // Obtener configuración del tenant para watermark
        const config = await ctx.db
            .query("siteConfig")
            .withIndex("by_tenant", q => q.eq("tenantId", args.tenantId))
            .unique();
        
        if (!config) {
            throw new Error("Configuración del tenant no encontrada");
        }
        
        // Generar nombre con prefijo del tenant
        const initials = config.initials || "ZN";
        const timestamp = Date.now();
        const watermarkedFilename = `${initials}_${timestamp}_${args.filename}`;
        
        // Subir con metadata especial de perfil
        const storageId = await ctx.db.insert("storageFiles", {
            tenantId: args.tenantId,
            originalFileId: args.file as any,
            storagePath: generateStoragePath(args.tenantId, "profile", watermarkedFilename),
            type: "profile",
            filename: watermarkedFilename,
            uploadedAt: Date.now(),
            uploadedBy: args.requestingUserId,
            metadata: {
                isProfileImage: true,
                initials,
                originalFilename: args.filename,
            },
        });
        
        // Actualizar configuración del tenant con la nueva imagen
        const currentProfileImages = config.profileImageIds || [];
        await ctx.db.patch(config._id, {
            profileImageIds: [...currentProfileImages, args.file as any],
        });
        
        return {
            storageId,
            filename: watermarkedFilename,
            initials,
        };
    },
});

/**
 * Verificar si un usuario puede acceder a archivos de un tenant
 */
export const canAccessTenantFiles = query({
    args: {
        tenantId: v.id("tenants"),
        requestingUserId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        try {
            // Intentar verificar acceso
            await requireTenantAccess(ctx, args.tenantId, args.requestingUserId);
            return { canAccess: true };
        } catch (error: any) {
            return { canAccess: false, reason: error.message || "Access denied" };
        }
    },
});
