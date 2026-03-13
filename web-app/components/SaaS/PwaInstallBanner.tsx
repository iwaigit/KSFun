'use client';

import { useState, useEffect } from 'react';
import { siteConfig } from '@/config/site';

export default function PwaInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            // Prevenir que el navegador muestre el prompt automático
            e.preventDefault();
            // Guardar el evento para dispararlo luego
            setDeferredPrompt(e);
            // Mostrar nuestro banner personalizado después de 5 segundos
            setTimeout(() => setShowBanner(true), 5000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Ocultar si ya está instalada
        window.addEventListener('appinstalled', () => {
            setShowBanner(false);
            setDeferredPrompt(null);
        });

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Mostrar el prompt nativo
        deferredPrompt.prompt();

        // Esperar la elección del usuario
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);

        // Limpiar el evento
        setDeferredPrompt(null);
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-8 md:bottom-8 md:w-96 animate-in slide-in-from-bottom-5 duration-500">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]/80 p-5 backdrop-blur-xl shadow-2xl">
                {/* ADN Zynch Accent */}
                <div className="absolute top-0 left-0 h-full w-1 bg-[#be2e57]" />

                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#be2e57]/10 text-2xl">
                        🦎
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white tracking-tight">Instala Zynch.app</h3>
                        <p className="mt-1 text-sm text-gray-400 leading-relaxed">
                            Accede más rápido y sin distracciones instalando nuestra App en tu inicio.
                        </p>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={handleInstallClick}
                                className="flex-1 rounded-lg bg-[#be2e57] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#a12649] active:scale-95 shadow-lg shadow-[#be2e57]/20"
                            >
                                Instalar Ahora
                            </button>
                            <button
                                onClick={() => {
                                    // Mostrar barra de instalación como el botón "Instalar Ahora"
                                    handleInstallClick();
                                }}
                                className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-white/10"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
