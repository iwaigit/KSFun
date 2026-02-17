'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function PacksAdmin() {
    const [selectedPack, setSelectedPack] = useState<string | null>(null);

    const packs = [
        { id: 'pack-pro', name: 'Pack Pro - Lencería', count: 124, size: '2.4 GB', color: 'neon-text-cyan' },
        { id: 'pack-premium', name: 'Pack Premium - VIP', count: 86, size: '1.8 GB', color: 'neon-text-pink' },
        { id: 'pack-ultimate', name: 'Pack Ultimate - Full Access', count: 210, size: '4.1 GB', color: 'neon-text-yellow' },
    ];

    return (
        <div className="min-h-screen bg-[#0d0d12] text-white flex">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-12 space-y-12 overflow-y-auto h-screen">
                <header className="space-y-2 border-b border-white/5 pb-8">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter">Gestión de <span className="neon-text-yellow">Packs VIP</span></h2>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Administración de Carpetas de Contenido Masivo</p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {packs.map((pack) => (
                        <div
                            key={pack.id}
                            onClick={() => setSelectedPack(pack.id)}
                            className={`group relative cursor-pointer transition-all ${selectedPack === pack.id ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                        >
                            <div className={`absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity ${pack.id === 'pack-pro' ? 'bg-[var(--color-neon-cyan)]' :
                                    pack.id === 'pack-premium' ? 'bg-[var(--color-neon-pink)]' : 'bg-[var(--color-neon-yellow)]'
                                }`} />

                            <div className={`relative glass-card bg-[#1a1a25]/90 p-8 border-white/5 flex flex-col gap-6 ${selectedPack === pack.id ? 'border-[var(--color-neon-cyan)]/50 border-2' : ''
                                }`}>
                                <div className="text-4xl">📂</div>
                                <div className="space-y-1">
                                    <h3 className={`text-xl font-black uppercase italic ${pack.color}`}>{pack.name}</h3>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{pack.id}</p>
                                </div>
                                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-white/30 uppercase">Archivos</p>
                                        <p className="font-mono text-white/80">{pack.count} Items</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[9px] font-black text-white/30 uppercase">Espacio</p>
                                        <p className="font-mono text-white/80">{pack.size}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedPack && (
                    <section className="glass-card bg-[#1a1a25]/90 p-10 border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-6">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                                Directorio: <span className="text-[var(--color-neon-cyan)]">{selectedPack.toUpperCase()}</span>
                            </h3>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                    📥 Descargar Todo (ZIP)
                                </button>
                                <button className="px-6 py-3 bg-[var(--color-neon-cyan)] text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:scale-105 transition-all">
                                    + Cargar Lote de Fotos
                                </button>
                            </div>
                        </div>

                        {/* Simulated File List */}
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors rounded-lg group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg opacity-50">🖼️</span>
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-bold text-white/80">ks_exclusive_{selectedPack}_{i}.jpg</p>
                                            <p className="text-[8px] text-white/20 uppercase font-black">2.4 MB / 4000x6000 px</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-[10px] text-white/40 hover:text-white uppercase font-black px-3 py-1 border border-white/10 rounded">Borrador</button>
                                        <button className="text-[10px] text-red-500/60 hover:text-red-500 uppercase font-black px-3 py-1 border border-red-500/20 rounded">Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
                                Nota: Esta carpeta está sincronizada con el Hosting Profesional.
                            </p>
                            <button className="text-[10px] font-black text-[var(--color-neon-pink)] uppercase tracking-widest hover:underline">
                                Ver carpeta en el servidor externo →
                            </button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
