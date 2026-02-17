import { z } from 'zod';

// Esquema para el formulario de contacto
export const contactSchema = z.object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z.string().email({ message: "Dirección de correo inválida" }),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, { message: "Número de teléfono inválido (10-15 dígitos)" }).optional(),
    message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres" }),
});

// Esquema para órdenes/pedidos (ejemplo)
export const orderSchema = z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    customerEmail: z.string().email(),
});

// Esquema para validación de imágenes
export const imageSchema = z.object({
    size: z.number().max(5 * 1024 * 1024, { message: "La imagen no debe superar los 5MB" }), // Validación pre-compresión
    type: z.string().regex(/^image\/(jpeg|png|webp)$/, { message: "Solo se permiten formatos JPG, PNG o WEBP" }),
});
