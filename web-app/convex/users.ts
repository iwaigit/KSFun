import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Registrar un nuevo prospecto (Lead)
export const register = mutation({
    args: {
        email: v.string(),
        password: v.string(),
        birthdate: v.string(),
        phone: v.string(),
    },
    handler: async (ctx, args) => {
        // Validar edad mínima (18+)
        const birthDate = new Date(args.birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            throw new Error("Debes tener al menos 18 años.");
        }

        // Validar formato de contraseña KSXXXXX
        if (!/^KS\d{5}$/.test(args.password)) {
            throw new Error("La contraseña debe empezar por 'KS' seguido de 5 números.");
        }

        // Insertar usuario
        const userId = await ctx.db.insert("users", {
            email: args.email,
            password: args.password,
            birthdate: args.birthdate,
            phone: args.phone,
            isVerified: false,
            role: "user",
            createdAt: Date.now(),
        });

        // Log de Actividad: Registro
        await ctx.db.insert("activityLogs", {
            userId,
            action: "user_registered",
            details: `Nuevo usuario registrado: ${args.email} con teléfono ${args.phone}`,
            timestamp: Date.now(),
        });

        return userId;
    },
});

// Login de usuario
export const login = query({
    args: {
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (!user || user.password !== args.password) {
            throw new Error("Credenciales inválidas.");
        }

        // Log de Actividad: Login
        await ctx.db.insert("activityLogs", {
            userId: user._id,
            action: "user_login",
            details: `Usuario ${user.email} inició sesión`,
            timestamp: Date.now(),
        });

        return { id: user._id, email: user.email, role: user.role };
    },
});

// Solicitar recuperación de clave (Simulado: en realidad enviaría un email)
export const requestPasswordReset = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (!user) {
            throw new Error("El correo no está registrado.");
        }

        // Aquí generaríamos un código y lo enviaríamos por correo
        console.log(`Enviando código de recuperación a ${args.email}`);
        return true;
    },
});

// Obtener usuario por email (para login futuro)
export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();
    },
});
