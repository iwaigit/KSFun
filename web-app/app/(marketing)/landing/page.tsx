import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="text-center text-white">
      <h1 className="text-6xl font-bold mb-6">
        Bienvenido a <span className="text-pink-300">Zynch</span>
      </h1>
      
      <p className="text-xl mb-8 text-pink-100">
        Tu plataforma camaleónica para servicios personales
      </p>
      
      <div className="space-y-4">
        <Link 
          href="https://admin.zynch.app"
          className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Comenzar Gratis
        </Link>
        
        <div className="mt-8">
          <p className="text-sm text-pink-200 mb-2">¿Ya tienes cuenta?</p>
          <Link 
            href="https://admin.zynch.app/login"
            className="text-pink-300 hover:text-pink-200 underline"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
      
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="font-bold mb-2">1. Regístrate</h3>
            <p className="text-sm">Crea tu cuenta gratuita en minutos</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="font-bold mb-2">2. Personaliza</h3>
            <p className="text-sm">Configura tu sitio con tu branding</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="font-bold mb-2">3. Publica</h3>
            <p className="text-sm">Tu sitio en tu-nombre.zynch.app</p>
          </div>
        </div>
      </div>
    </div>
  );
}
