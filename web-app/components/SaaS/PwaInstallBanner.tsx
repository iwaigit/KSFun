"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

export default function PwaInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Esperar 5 segundos antes de mostrar el banner
    const timer = setTimeout(() => {
      checkInstallability();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const checkInstallability = () => {
    // Verificar si el PWA ya está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return; // Ya está instalado, no mostrar banner
    }

    // Verificar si es móvil y el usuario aún no ha instalado
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && !localStorage.getItem("pwa-banner-dismissed")) {
      setIsVisible(true);
      setIsInstallable(true);
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        console.log("Usuario aceptó instalar el PWA");
        setIsVisible(false);
        localStorage.setItem("pwa-banner-dismissed", "true");
      }
      
      setDeferredPrompt(null);
    } else {
      // Para iOS, mostrar instrucciones
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS) {
        alert("Para instalar Zynch: 1) Toca el botón Compartir 2) 'Añadir a pantalla de inicio'");
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  if (!isVisible || !isInstallable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 mx-auto max-w-sm z-50 bg-[var(--bg-dark)] border border-[var(--color-neon-pink)] rounded-lg p-4 shadow-lg backdrop-blur-md bg-opacity-95">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[var(--color-neon-pink)] rounded-full flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Instalar Zynch</p>
            <p className="text-[var(--color-muted-blue)] text-xs">Acceso rápido y offline</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleInstall}
            className="bg-[var(--color-neon-pink)] hover:bg-opacity-90 text-white px-3 py-1 rounded-md text-sm font-medium transition-all"
          >
            Instalar
          </button>
          <button
            onClick={handleDismiss}
            className="text-[var(--color-muted-blue)] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
