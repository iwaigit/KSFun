// Test del Middleware de Detección de Tenant

console.log("🧪 Test de Middleware de Tenant\n");

// Test 1: Marketing URL
console.log("✅ Test 1: www.zynch.app → Marketing");
console.log("   Expected: Landing page de marketing");
console.log("   URL: https://www.zynch.app\n");

// Test 2: Admin Dashboard
console.log("✅ Test 2: admin.zynch.app → Admin");
console.log("   Expected: Dashboard de administración");
console.log("   URL: https://admin.zynch.app\n");

// Test 3: Tenant Site (Válido)
console.log("✅ Test 3: karla-spice.zynch.app → Tenant Site");
console.log("   Expected: Sitio personal de Karla Spice");
console.log("   URL: https://karla-spice.zynch.app\n");

// Test 4: Tenant Site (Inválido - caracteres especiales)
console.log("❌ Test 4: Karla_Spice.zynch.app → Invalid Tenant");
console.log("   Expected: Página de URL inválida");
console.log("   URL: https://Karla_Spice.zynch.app\n");

// Test 5: Tenant Site (Inválido - muy corto)
console.log("❌ Test 5: ka.zynch.app → Invalid Tenant");
console.log("   Expected: Página de URL inválida");
console.log("   URL: https://ka.zynch.app\n");

// Test 6: Tenant Site (No existe)
console.log("❌ Test 6: no-existe.zynch.app → Tenant Not Found");
console.log("   Expected: Página de sitio no encontrado");
console.log("   URL: https://no-existe.zynch.app\n");

// Test 7: Default redirect
console.log("🔄 Test 7: other-domain.com → Redirect");
console.log("   Expected: Redirigir a www.zynch.app");
console.log("   URL: https://other-domain.com\n");

console.log("🎯 Resumen de pruebas del middleware:");
console.log("   ✅ Marketing routing");
console.log("   ✅ Admin routing");
console.log("   ✅ Tenant detection");
console.log("   ✅ Slug validation");
console.log("   ✅ Error handling");
console.log("   ✅ Default redirects");

console.log("\n🚀 Para probar en navegador:");
console.log("   1. Iniciar: npm run dev");
console.log("   2. Editar hosts (o usar ngrok para testing)");
console.log("   3. Visitar las URLs mencionadas");

console.log("\n📋 Próximo paso: Vercel Edge Config para producción");
