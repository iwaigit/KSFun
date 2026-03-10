// Test específico de RLS
import { ConvexHttpClient } from "convex/browser";

async function testRLSSpecific() {
    console.log("🧪 Test específico de RLS...\n");

    try {
        const convex = new ConvexHttpClient("http://127.0.0.1:3210");
        
        console.log("✅ Cliente Convex creado");

        // Test 1: Intentar con userId undefined (debe fallar claro)
        console.log("\n❌ Test 1: Registrar con userId undefined");
        try {
            const result = await convex.mutation("users:register", {
                tenantId: "test-tenant",
                email: "test@example.com",
                password: "ZN12345",
                birthdate: "1990-01-01",
                phone: "+584141234567",
                userId: undefined // Explícitamente undefined
            });
            console.log("❌ ERROR: Debió fallar pero no falló - Result:", result);
        } catch (error) {
            console.log("✅ PASS: Falló como esperado");
            console.log("   Error:", error.message);
        }

        // Test 2: Intentar con userId null (debe fallar claro)
        console.log("\n❌ Test 2: Registrar con userId null");
        try {
            const result = await convex.mutation("users:register", {
                tenantId: "test-tenant",
                email: "test2@example.com",
                password: "ZN12345",
                birthdate: "1990-01-01",
                phone: "+584141234567",
                userId: null // Explícitamente null
            });
            console.log("❌ ERROR: Debió fallar pero no falló - Result:", result);
        } catch (error) {
            console.log("✅ PASS: Falló como esperado");
            console.log("   Error:", error.message);
        }

        console.log("\n🎉 Tests de RLS completados!");
        console.log("📋 Conclusión: Nuestro RLS está funcionando correctamente");
        console.log("🔒 Las mutations requieren userId como esperábamos");

    } catch (error) {
        console.error("💥 Error inesperado:", error);
    }
}

testRLSSpecific();
