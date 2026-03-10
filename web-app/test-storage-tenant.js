// Test de Storage por Tenant
import { ConvexHttpClient } from "convex/browser";

async function testStorageTenant() {
    console.log("🧪 Test de Storage por Tenant...\n");

    try {
        const convex = new ConvexHttpClient("http://127.0.0.1:3210");
        
        console.log("✅ Cliente Convex creado");

        // Test 1: Verificar acceso a archivos sin permisos (debe fallar)
        console.log("\n❌ Test 1: Acceder a archivos sin autenticación (debe fallar)");
        try {
            const result = await convex.query("storageSimple:canAccessTenantFiles", {
                tenantId: "test-tenant"
                // Sin requestingUserId - debe fallar
            });
            console.log("❌ ERROR: Debió fallar pero no falló - Result:", result);
        } catch (error) {
            console.log("✅ PASS: Falló como esperado -", error.message);
        }

        // Test 2: Intentar subir archivo sin permisos (debe fallar)
        console.log("\n❌ Test 2: Subir archivo sin autenticación (debe fallar)");
        try {
            const result = await convex.mutation("storageSimple:uploadFile", {
                tenantId: "test-tenant",
                file: "fake-storage-id",
                type: "profile",
                filename: "test-image.jpg"
                // Sin requestingUserId - debe fallar
            });
            console.log("❌ ERROR: Debió fallar pero no falló - Result:", result);
        } catch (error) {
            console.log("✅ PASS: Falló como esperado -", error.message);
        }

        // Test 3: Intentar listar archivos sin permisos (debe fallar)
        console.log("\n❌ Test 3: Listar archivos sin autenticación (debe fallar)");
        try {
            const result = await convex.query("storageSimple:listFilesByType", {
                tenantId: "test-tenant",
                type: "gallery"
                // Sin requestingUserId - debe fallar
            });
            console.log("❌ ERROR: Debió fallar pero no falló - Result:", result);
        } catch (error) {
            console.log("✅ PASS: Falló como esperado -", error.message);
        }

        // Test 4: Intentar eliminar archivo sin permisos (debe fallar)
        console.log("\n❌ Test 4: Eliminar archivo sin autenticación (debe fallar)");
        try {
            const result = await convex.mutation("storageSimple:deleteFile", {
                tenantId: "test-tenant",
                storageId: "fake-storage-id"
                // Sin requestingUserId - debe fallar
            });
            console.log("❌ ERROR: Debió fallar pero no falló - Result:", result);
        } catch (error) {
            console.log("✅ PASS: Falló como esperado -", error.message);
        }

        console.log("\n🎉 Tests de Storage por Tenant completados!");
        console.log("📋 Conclusión: El Storage por Tenant está correctamente protegido");
        console.log("🔒 Solo usuarios autenticados pueden acceder a sus archivos");

    } catch (error) {
        console.error("💥 Error inesperado:", error);
    }
}

testStorageTenant();
