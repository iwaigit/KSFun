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
    size: z.number().max(50 * 1024 * 1024, { message: "La imagen es demasiado pesada (máx 50MB antes de comprimir)" }),
    type: z.string().regex(/^image\/(jpeg|png|webp)$/, { message: "Solo se permiten formatos JPG, PNG o WEBP" }),
});

// Esquema para registro de usuarios
export const registrationSchema = z.object({
    email: z.string()
        .email({ message: "Formato de correo electrónico inválido" })
        .min(5, { message: "El correo debe tener al menos 5 caracteres" })
        .max(100, { message: "El correo es demasiado largo" })
        .toLowerCase(),

    password: z.string()
        .min(5, { message: "La contraseña debe tener 5 dígitos" })
        .max(7, { message: "La contraseña debe ser KS + 5 dígitos" })
        .transform((val) => {
            // Auto-add KS prefix if user only entered numbers
            if (/^\d{5}$/.test(val)) {
                return `KS${val}`;
            }
            // Convert to uppercase
            return val.toUpperCase();
        })
        .refine((val) => /^KS\d{5}$/.test(val), {
            message: "La contraseña debe ser KS seguido de 5 dígitos (ej: KS12345)"
        }),

    birthdate: z.string()
        .refine((date) => {
            const birthDate = new Date(date);
            const today = new Date();

            // No future dates
            if (birthDate > today) {
                return false;
            }

            // Calculate age
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            // Age must be between 18 and 120
            return age >= 18 && age <= 120;
        }, {
            message: "Debes tener entre 18 y 120 años para registrarte"
        }),

    phone: z.string()
        .regex(/^\+\d{10,15}$/, {
            message: "El teléfono debe estar en formato internacional: +código_país + número (ej: +584121234567)"
        })
        .min(11, { message: "El número de teléfono es demasiado corto" })
        .max(16, { message: "El número de teléfono es demasiado largo" }),
});

