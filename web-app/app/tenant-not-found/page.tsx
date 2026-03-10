import Link from 'next/link';

export default function TenantNotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
            <span className="text-4xl text-gray-400">🏢</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sitio No Encontrado
        </h1>
        
        <p className="text-gray-600 mb-8">
          El sitio que buscas no existe o ha sido desactivado.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="https://www.zynch.app"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Ir a Zynch
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>¿Eres el dueño de este sitio?</p>
            <Link 
              href="https://admin.zynch.app"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Inicia sesión para administrarlo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
