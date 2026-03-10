// Test con cliente Convex
import { ConvexHttpClient } from "convex/browser";

async function testConvexClient() {
    console.log("🧪 Test con cliente Convex...\n");

    try {
        // Crear cliente Convex
        const convex = new ConvexHttpClient(process.env.CONVEX_URL || "http://127.0.0.1:3210");
        
        console.log("✅ Cliente Convex creado");

        // Test 1: Intentar mutation sin userId (debe fallar)
        console.log("\n❌ Test 1: Registrar sin userId");
        try {
            await convex.mutation("users:register", {
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

        console.log("\n🎉 Test completado!");

    } catch (error) {
        console.error("💥 Error creando cliente:", error);
    }
}

testConvexClient();
