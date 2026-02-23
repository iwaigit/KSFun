'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const VEN_CITIES = [
    "Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay",
    "Ciudad Guayana", "San Cristóbal", "Maturín", "Barcelona", "Puerto Cruz",
    "Mérida", "Cumaná", "Barinas", "Los Teques", "San Antonio", "Lechería"
];

const PAYMENT_OPTIONS = [
    "Ca$h", "Pago móvil", "Transferencia", "Zelle", "Criptomonedas", "PayPal", "Zinli"
];

const SERVICE_STYLES = [
    "Trato de Novia", "Cita Social", "Masajes Relajantes", "Fetichismo"
];

const TARGET_AUDIENCE = ["Hombres", "Mujeres", "Parejas"];

const DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export default function AdminConfig() {
    const config = useQuery(api.siteConfig.get);
    const updateConfig = useMutation(api.siteConfig.update);
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        if (config) {
            setFormData({
                ...config,
                locations: config.locations || ["Caracas"],
                weight: config.weight || "",
                schedule: config.schedule || { is24h: true, workingDays: DAYS },
                pricing: config.pricing || { h1: 0 },
                vesRate: config.vesRate || 0,
                taxiIncluded: config.taxiIncluded ?? false,
                paymentMethods: config.paymentMethods || ["Ca$h"],
                services: config.services || ["Trato de Novia"],
                targetAudience: config.targetAudience || ["Hombres"],
                activePromo: config.activePromo || { label: "", description: "", isActive: false },
                personalMessage: config.personalMessage || "",
                profileImages: config.profileImages || []
            });
        }
    }, [config]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { _id, _creationTime, ...cleanData } = formData;
        await updateConfig(cleanData);
        alert('Configuración actualizada con éxito');
    };

    const toggleArrayItem = (field: string, item: string) => {
        const current = formData[field] || [];
        const next = current.includes(item)
            ? current.filter((i: string) => i !== item)
            : [...current, item];
        setFormData({ ...formData, [field]: next });
    };

    if (!formData) return <div className="p-12 animate-pulse text-white/20 font-black uppercase tracking-widest">Cargando Configuración Estructural...</div>;

    return (
        <main className="flex-1 p-8 md:p-12 space-y-12 max-w-5xl">
            <header className="space-y-2 border-b border-white/5 pb-8">
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight leading-none whitespace-nowrap">Configuración de <span className="neon-text-cyan">Perfil & Branding</span></h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Control Maestro de Datos y Precios de Servicio</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Sección Fotos de Perfil (Carrusel) */}
                    <section className="col-span-full glass-card p-6 space-y-6 border-white/5 border-t-2 border-[var(--color-neon-cyan)]">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-neon-cyan)] border-b border-white/5 pb-2">🖼️ Fotos de Perfil (Carrusel)</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[0, 1].map(index => (
                                <div key={index} className="space-y-3">
                                    <label className="text-[9px] font-black uppercase text-white/40">Foto #{index + 1} (URL)</label>
                                    <input
                                        type="text"
                                        value={formData.profileImages[index] || ''}
                                        onChange={e => {
                                            const newPics = [...formData.profileImages];
                                            newPics[index] = e.target.value;
                                            setFormData({ ...formData, profileImages: newPics });
                                        }}
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded font-mono text-white text-[10px]"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                    {formData.profileImages[index] && (
                                        <div className="aspect-video rounded overflow-hidden border border-white/10">
                                            <img src={formData.profileImages[index]} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Columna Izquierda: Datos Básicos */}
                    <div className="space-y-8">
                        {/* Ciudades */}
                        <section className="glass-card p-6 space-y-4 border-white/5">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">📍 Ubicaciones (Venezuela)</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {VEN_CITIES.map(city => (
                                    <label key={city} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.locations.includes(city)}
                                            onChange={() => toggleArrayItem('locations', city)}
                                            className="accent-[var(--color-neon-cyan)]"
                                        />
                                        <span className={`text-[10px] font-bold uppercase transition-colors ${formData.locations.includes(city) ? 'text-white' : 'text-white/30'}`}>{city}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Precios CA$H */}
                        <section className="glass-card p-6 space-y-6 border-white/5 border-l-4 border-[var(--color-neon-cyan)]">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-neon-cyan)] border-b border-white/5 pb-2">💵 Tarifas de Servicio (CA$H)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-white/40">1 Hora</label>
                                    <input
                                        type="number"
                                        value={formData.pricing.h1}
                                        onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, h1: Number(e.target.value) } })}
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded font-mono text-white text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-white/40">2 Horas</label>
                                    <input
                                        type="number"
                                        value={formData.pricing.h2 || ''}
                                        onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, h2: Number(e.target.value) } })}
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded font-mono text-white text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-white/40">Hora Nocturna</label>
                                    <input
                                        type="number"
                                        value={formData.pricing.night || ''}
                                        onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, night: Number(e.target.value) } })}
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded font-mono text-white text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-white/40">Cargo Extra (Label)</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Detroit Adicional"
                                        value={formData.pricing.customLabel || ''}
                                        onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, customLabel: e.target.value } })}
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded font-bold text-white text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-white/40">Cargo Extra (Precio)</label>
                                    <input
                                        type="number"
                                        value={formData.pricing.customPrice || ''}
                                        onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, customPrice: Number(e.target.value) } })}
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded font-mono text-white text-xs"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[9px] font-black uppercase text-white/40">Tasa VES (BCV/Hoy)</label>
                                    <input
                                        type="number"
                                        value={formData.vesRate}
                                        onChange={e => setFormData({ ...formData, vesRate: Number(e.target.value) })}
                                        className="w-full bg-[#ff2d75]/5 border border-[#ff2d75]/20 p-3 rounded font-mono text-[var(--color-neon-pink)] text-xs font-black"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 p-4 rounded">
                                <input
                                    type="checkbox"
                                    checked={formData.taxiIncluded}
                                    onChange={e => setFormData({ ...formData, taxiIncluded: e.target.checked })}
                                    className="accent-[var(--color-neon-pink)]"
                                />
                                <span className="text-[10px] font-black uppercase text-white/60">¿Taxi Incluido en el precio?</span>
                            </div>
                        </section>
                    </div>

                    {/* Columna Derecha: Horarios y Estilos */}
                    <div className="space-y-8">
                        {/* Horario */}
                        <section className="glass-card p-6 space-y-6 border-white/5">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">⏰ Disponibilidad / Horario</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, schedule: { ...formData.schedule, is24h: !formData.schedule.is24h } })}
                                    className={`px-4 py-2 border text-[10px] font-black uppercase tracking-widest transition-all ${formData.schedule.is24h ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 text-white/20 border-white/10'}`}
                                >
                                    {formData.schedule.is24h ? '24 HORAS ACTIVO' : 'HORARIO PERSONALIZADO'}
                                </button>
                            </div>
                            {!formData.schedule.is24h && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black uppercase text-white/20">Desde</label>
                                        <input
                                            type="time"
                                            value={formData.schedule.from || ''}
                                            onChange={e => setFormData({ ...formData, schedule: { ...formData.schedule, from: e.target.value } })}
                                            className="w-full bg-white/5 border border-white/10 p-2 rounded text-white text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black uppercase text-white/20">Hasta</label>
                                        <input
                                            type="time"
                                            value={formData.schedule.to || ''}
                                            onChange={e => setFormData({ ...formData, schedule: { ...formData.schedule, to: e.target.value } })}
                                            className="w-full bg-white/5 border border-white/10 p-2 rounded text-white text-xs"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-white/40 tracking-widest">Días Laborables</label>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleArrayItem('schedule', day)}
                                            className={`w-10 h-10 flex items-center justify-center text-[10px] font-black uppercase border transition-all ${formData.schedule.workingDays.includes(day) ? 'bg-white text-black border-white' : 'bg-white/5 text-white/20 border-white/5 hover:border-white/20'}`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Pagos y Servicios */}
                        <div className="grid grid-cols-2 gap-6">
                            <section className="glass-card p-4 space-y-4 border-white/5">
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">💳 Métodos de Pago</h3>
                                <div className="space-y-2">
                                    {PAYMENT_OPTIONS.map(opt => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={formData.paymentMethods.includes(opt)}
                                                onChange={() => toggleArrayItem('paymentMethods', opt)}
                                                className="accent-[var(--color-neon-pink)] scale-75"
                                            />
                                            <span className={`text-[9px] font-bold uppercase ${formData.paymentMethods.includes(opt) ? 'text-white' : 'text-white/20'}`}>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                            <section className="glass-card p-4 space-y-4 border-white/5">
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">🎀 Estilos / Servicios</h3>
                                <div className="space-y-2">
                                    {SERVICE_STYLES.map(style => (
                                        <label key={style} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={formData.services.includes(style)}
                                                onChange={() => toggleArrayItem('services', style)}
                                                className="accent-[var(--color-neon-pink)] scale-75"
                                            />
                                            <span className={`text-[9px] font-bold uppercase ${formData.services.includes(style) ? 'text-white' : 'text-white/20'}`}>{style}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Atiendo a */}
                        <section className="glass-card p-6 space-y-4 border-white/5 border-r-4 border-[var(--color-neon-yellow)]">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-neon-yellow)] border-b border-white/5 pb-2">👥 Atiendo a</h3>
                            <div className="flex gap-6">
                                {TARGET_AUDIENCE.map(target => (
                                    <label key={target} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.targetAudience.includes(target)}
                                            onChange={() => toggleArrayItem('targetAudience', target)}
                                            className="accent-[var(--color-neon-yellow)]"
                                        />
                                        <span className={`text-[10px] font-bold uppercase transition-colors ${formData.targetAudience.includes(target) ? 'text-white' : 'text-white/30'}`}>{target}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Promoción y Mensaje */}
                <div className="grid lg:grid-cols-2 gap-10">
                    <section className="glass-card p-6 space-y-4 border-white/5 border-t-2 border-[var(--color-neon-pink)]">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-neon-pink)]">🔥 Promoción Activa</h3>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, activePromo: { ...formData.activePromo, isActive: !formData.activePromo.isActive } })}
                                className={`px-3 py-1 text-[8px] font-black uppercase border transition-all ${formData.activePromo.isActive ? 'bg-pink-500 text-white border-pink-500' : 'bg-white/5 text-white/40 border-white/10'}`}
                            >
                                {formData.activePromo.isActive ? 'ACTIVA' : 'INACTIVA'}
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Título de la Promo (ej: Especial Fin de Semana)"
                                value={formData.activePromo.label}
                                onChange={e => setFormData({ ...formData, activePromo: { ...formData.activePromo, label: e.target.value } })}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded font-bold text-white text-xs"
                            />
                            <textarea
                                placeholder="Descripción de la promoción..."
                                value={formData.activePromo.description}
                                onChange={e => setFormData({ ...formData, activePromo: { ...formData.activePromo, description: e.target.value } })}
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded font-bold text-white text-xs resize-none"
                            />
                        </div>
                    </section>

                    <section className="glass-card p-6 space-y-4 border-white/5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">✍️ Mensaje Personal / Bio Corta</h3>
                        <textarea
                            value={formData.personalMessage}
                            onChange={e => setFormData({ ...formData, personalMessage: e.target.value })}
                            rows={4}
                            placeholder="Escribe un mensaje sugerente o informativo para el perfil..."
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-bold text-sm outline-none focus:border-[var(--color-neon-pink)] transition-colors resize-none text-white/80"
                        />
                    </section>
                </div>

                {/* Botón Guardar */}
                <div className="flex justify-end sticky bottom-0 z-50 py-6 bg-[#0d0d12]/80 backdrop-blur-md">
                    <button
                        type="submit"
                        className="px-16 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.4em] shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(0,243,255,0.4)] hover:bg-[var(--color-neon-cyan)] transition-all transform hover:-translate-y-1"
                    >
                        Publicar Cambios Estructurales
                    </button>
                </div>
            </form>
        </main>
    );
}
