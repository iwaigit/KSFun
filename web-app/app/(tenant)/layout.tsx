import { headers } from 'next/headers';
import { ReactNode } from 'react';

export default async function TenantLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Obtener información del tenant del middleware
  const headersList = await headers();
  const tenantSlug = headersList.get('x-tenant-slug');
  const tenantName = headersList.get('x-tenant-name');
  const tenantAlias = headersList.get('x-tenant-alias');
  const tenantPlan = headersList.get('x-tenant-plan');

  // Si no hay información de tenant, mostrar página de error
  if (!tenantSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sitio No Encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            El sitio que buscas no existe o está inactivo.
          </p>
          <a 
            href="https://www.zynch.app"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Ir a Zynch
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con información del tenant */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">
                {tenantAlias || tenantName}
              </h1>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {tenantPlan}
              </span>
            </div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Inicio
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Galería
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Citas
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Contacto
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2026 {tenantAlias || tenantName}. Todos los derechos reservados.
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Desarrollado con ❤️ por{' '}
            <a href="https://www.zynch.app" className="hover:text-purple-300">
              Zynch
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
