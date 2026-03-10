import Link from 'next/link';

export default function InvalidTenantPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center">
            <span className="text-4xl text-red-400">⚠️</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          URL Inválida
        </h1>
        
        <p className="text-gray-600 mb-4">
          Los nombres de sitio solo pueden contener:
        </p>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-8 text-left text-sm">
          <ul className="space-y-2 text-gray-700">
            <li>• Letras minúsculas (a-z)</li>
            <li>• Números (0-9)</li>
            <li>• Guiones (-)</li>
            <li>• Mínimo 3 caracteres</li>
            <li>• Máximo 30 caracteres</li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Ejemplos válidos:
          </p>
          <div className="bg-purple-50 rounded-lg p-3 text-sm font-mono text-purple-700">
            karla-spice.zynch.app<br/>
            jennifer123.zynch.app<br/>
            top-models.zynch.app
          </div>
          
          <Link 
            href="https://www.zynch.app"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Ir a Zynch
          </Link>
        </div>
      </div>
    </div>
  );
}
