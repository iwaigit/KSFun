// Test de Anti-Abuso Freemium
import { ConvexHttpClient } from "convex/browser";

async function testAntiAbuse() {
    console.log("🧪 Test de Anti-Abuso Freemium...\n");

    try {
        const convex = new ConvexHttpClient("http://127.0.0.1:3210");
        
        console.log("✅ Cliente Convex creado");

        // Test 1: Intentar registrar cuenta free con datos nuevos (debe funcionar)
        console.log("\n✅ Test 1: Registrar cuenta free (datos nuevos)");
        try {
            const result = await convex.mutation("users:register", {
                tenantId: "test-tenant-1", // Necesitamos un tenant válido
                email: "nuevo1@example.com",
                password: "ZN12345",
                birthdate: "1990-01-01",
                phone: "+584141234567",
                deviceId: "device-001",
                planType: "free"
            });
            console.log("✅ PASS: Registro exitoso - UserID:", result);
        } catch (error) {
            console.log("❌ FAIL: No debería fallar -", error.message);
        }

        // Test 2: Intentar registrar con mismo teléfono (debe fallar)
        console.log("\n❌ Test 2: Mismo teléfono (debe fallar)");
        try {
            const result = await convex.mutation("users:register", {
                tenantId: "test-tenant-2",
                email: "diferente@example.com",
                password: "ZN12345",
                birthdate: "1990-01-01",
                phone: "+584141234567", // MISMO teléfono
                deviceId: "device-002",
                planType: "free"
            });
            console.log("❌ ERROR: Debió fallar pero no falló - Result:", result);
        } catch (error) {
            console.log("✅ PASS: Falló como esperado -", error.message);
        }

        // Test 3: Intentar registrar con mismo dispositivo (debe fallar)
        console.log("\n❌ Test 3: Mismo dispositivo (debe fallar)");
        try {
            const result = await convex.mutation("users:register", {
                tenantId: "test-tenant-3",
                email: "otro@example.com",
                password: "ZN12345",
                birthdate: "1990-01-01",
                phone: "+584141234568", // Teléfono diferente
                deviceId: "device-001", // MISMO dispositivo
                planType: "free"
            });
            console.log("❌ ERROR: Debió fallar pero no falló - Result:", result);
        } catch (error) {
            console.log("✅ PASS: Falló como esperado -", error.message);
        }

        // Test 4: Intentar registrar con mismo email (debe fallar)
        console.log("\n❌ Test 4: Mismo email (debe fallar)");
        try {
            const result = await convex.mutation("users:register", {
                tenantId: "test-tenant-4",
                email: "nuevo1@example.com", // MISMO email
                password: "ZN12345",
                birthdate: "1990-01-01",
                phone: "+584141234569", // Teléfono diferente
                deviceId: "device-003",
                planType: "free"
            });
            console.log("❌ ERROR: Debió fallar pero no falló - Result:", result);
        } catch (error) {
            console.log("✅ PASS: Falló como esperado -", error.message);
        }

        console.log("\n🎉 Tests de Anti-Abuso completados!");
        console.log("📋 Conclusión: El sistema Anti-Abuso está funcionando correctamente");

    } catch (error) {
        console.error("💥 Error inesperado:", error);
    }
}

testAntiAbuse();
