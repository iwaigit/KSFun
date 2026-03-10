import { headers } from 'next/headers';

export default async function TenantSitePage() {
  // Obtener información del tenant del middleware
  const headersList = await headers();
  const tenantSlug = headersList.get('x-tenant-slug');
  const tenantName = headersList.get('x-tenant-name');
  const tenantAlias = headersList.get('x-tenant-alias');
  const tenantPlan = headersList.get('x-tenant-plan');

  const displayName = tenantAlias || tenantName || 'Zynch';

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl">
        <h1 className="text-5xl font-bold mb-4">
          {displayName}
        </h1>
        <p className="text-xl mb-8">
          Bienvenido a mi espacio personal
        </p>
        <div className="space-x-4">
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Agendar Cita
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
            Ver Galería
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Sobre Mí</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 leading-relaxed">
              Profesional dedicado/a a ofrecer los mejores servicios 
              con atención personalizada y de alta calidad.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">Servicios Personalizados</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                <span className="text-gray-700">Atención Premium</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-gray-700">Experiencia Comprobada</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-gray-900">Información de Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-900">contacto@{tenantSlug}.zynch.app</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Plan:</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                  {tenantPlan}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Servicios</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Consultas",
              description: "Asesoramiento personalizado",
              price: "Desde $50"
            },
            {
              title: "Sesiones",
              description: "Servicios completos",
              price: "Desde $100"
            },
            {
              title: "Paquetes",
              description: "Múltiples sesiones con descuento",
              price: "Desde $250"
            }
          ].map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-xl mb-3 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="text-2xl font-bold text-purple-600">{service.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">¿Interesado/a?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Agenda tu cita ahora o contáctame para más información sobre mis servicios
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Agendar Cita Ahora
          </button>
          <button className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-colors">
            Enviar Mensaje
          </button>
        </div>
      </section>
    </div>
  );
}
