import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Genera una URL de subida para el storage de Convex.
 */
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

/**
 * Guarda la referencia de una foto subida en la tabla gallery.
 */
export const savePhoto = mutation({
    args: {
        storageId: v.id("_storage"),
        alt: v.string(),
        order: v.number(),
    },
    handler: async (ctx, args) => {
        const photoId = await ctx.db.insert("gallery", {
            storageId: args.storageId,
            alt: args.alt,
            order: args.order,
            createdAt: Date.now(),
        });
        return photoId;
    },
});

/**
 * Lista todas las fotos de la galería con sus URLs públicas temporales.
 */
export const listPhotos = query({
    handler: async (ctx) => {
        const photos = await ctx.db
            .query("gallery")
            .withIndex("by_order")
            .collect();

        return Promise.all(
            photos.map(async (photo) => ({
                ...photo,
                url: await ctx.storage.getUrl(photo.storageId),
            }))
        );
    },
});

/**
 * Elimina una foto de la galería y su archivo asociado en el storage.
 */
export const deletePhoto = mutation({
    args: { id: v.id("gallery") },
    handler: async (ctx, args) => {
        const photo = await ctx.db.get(args.id);
        if (!photo) return;

        // Eliminar del storage
        await ctx.storage.delete(photo.storageId);
        // Eliminar registro
        await ctx.db.delete(args.id);
    },
});

/**
 * Actualiza el orden de las fotos.
 */
export const updateOrder = mutation({
    args: {
        id: v.id("gallery"),
        order: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { order: args.order });
    },
});
