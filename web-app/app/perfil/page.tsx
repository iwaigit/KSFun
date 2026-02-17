'use client';

import { useEffect, useState } from 'react';
import AboutKarla from '@/components/AboutKarla';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

export default function Perfil() {
    const { t } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-[#0d0d12] text-white p-6 md:p-12 selection:bg-[#ff2d75]">
            {/* Navigation */}
            <nav className="max-w-4xl mx-auto mb-12 flex justify-between items-center">
                <Link href="/" className="font-black uppercase tracking-widest text-[var(--color-neon-cyan)] hover:neon-text-cyan transition-all text-sm">
                    {t('nav.back')}
                </Link>
                <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/20">
                    KARLA_SPICE_BIO_CORE_V2
                </div>
            </nav>

            <div className="space-y-16">
                <AboutKarla />

                {/* Botón de Acceso a Galería - Única Entrada */}
                <div className="max-w-4xl mx-auto pt-10 flex flex-col items-center gap-8 border-t border-white/10">
                    <div className="text-center space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 text-center">{t('profile.level_access')}</p>
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase neon-text-pink">{t('profile.filtered_content')}</h3>
                    </div>

                    <Link
                        href="/galeria"
                        className={`
                            glass-card border border-[var(--color-neon-pink)]
                            hover:shadow-[0_0_25px_rgba(255,45,117,0.4)]
                            hover:-translate-y-1 active:scale-95 transition-all duration-300
                            text-xs px-12 py-5 group text-white font-black uppercase tracking-widest
                        `}
                    >
                        <span className="flex items-center gap-3">
                            {t('profile.gallery_btn')} <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    </Link>

                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] max-w-xs text-center leading-relaxed">
                        {t('profile.min_age')}
                    </p>
                </div>
            </div>

            {/* Footer Decoration */}
            <div className="max-w-4xl mx-auto mt-20 pt-8 flex justify-center">
                <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 bg-[var(--color-neon-pink)] animate-ping" />
                    <div className="w-1.5 h-1.5 bg-[var(--color-neon-cyan)] animate-ping delay-300" />
                    <div className="w-1.5 h-1.5 bg-[var(--color-neon-fuchsia)] animate-ping delay-700" />
                </div>
            </div>
        </main>
    );
}
