// Test simple para verificar que Convex funciona
const { api } = require("./convex/_generated/api");

async function simpleTest() {
    console.log("🧪 Test simple de Convex...\n");

    try {
        // Test 1: Intentar query sin autenticación (debe fallar)
        console.log("❌ Test 1: Query sin autenticación");
        try {
            const result = await api.users.get({});
            console.log("❌ ERROR: Debió fallar pero no falló");
        } catch (error) {
            console.log("✅ PASS: Falló como esperado -", error.message);
        }

    } catch (error) {
        console.error("💥 Error inesperado:", error);
    }
}

simpleTest();
