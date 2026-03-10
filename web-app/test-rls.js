// Script de prueba para RLS
// Para ejecutar: node test-rls.js

const { convex } = require("./convex/_generated/api");

async function testRLS() {
    console.log("🧪 Probando Row Level Security...\n");

    try {
        // Test 1: Intentar registrar sin userId (debe fallar)
        console.log("❌ Test 1: Registrar sin userId");
        try {
            await convex.mutation.users.register({
                tenantId: "test-tenant",
                email: "test@example.com",
                password: "ZN12345",
                birthdate: "1990-01-01",
                phone: "+584141234567"
                // Sin userId - debe fallar
            });
            console.log("❌ ERROR: Debió fallar pero no falló");
        } catch (error) {
            console.log("✅ PASS: Falló como esperado -", error.message);
        }

        console.log("\n");

        // Test 2: Intentar login sin userId (debe fallar)
        console.log("❌ Test 2: Login sin userId");
        try {
            await convex.mutation.users.login({
                tenantId: "test-tenant",
                email: "test@example.com",
                password: "ZN12345"
                // Sin userId - debe fallar
            });
            console.log("❌ ERROR: Debió fallar pero no falló");
        } catch (error) {
            console.log("✅ PASS: Falló como esperado -", error.message);
        }

        console.log("\n");

        // Test 3: Intentar crear cita sin userId (debe fallar)
        console.log("❌ Test 3: Crear cita sin userId");
        try {
            await convex.mutation.appointments.create({
                tenantId: "test-tenant",
                userId: "test-user",
                date: "2026-03-10",
                time: "14:00"
                // Sin requestingUserId - debe fallar
            });
            console.log("❌ ERROR: Debió fallar pero no falló");
        } catch (error) {
            console.log("✅ PASS: Falló como esperado -", error.message);
        }

        console.log("\n🎉 Tests completados!");

    } catch (error) {
        console.error("💥 Error inesperado:", error);
    }
}

// Ejecutar tests
testRLS();
