'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import AdminSidebar from '@/components/AdminSidebar';
import { Id } from '@/convex/_generated/dataModel';

export default function GaleriaAdmin() {
    const photos = useQuery(api.gallery.listPhotos);
    const generateUploadUrl = useMutation(api.gallery.generateUploadUrl);
    const savePhoto = useMutation(api.gallery.savePhoto);
    const deletePhoto = useMutation(api.gallery.deletePhoto);

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if ((photos?.length || 0) >= 24) {
            alert("Has alcanzado el límite de 2 docenas (24 fotos) en la galería.");
            return;
        }

        setIsUploading(true);
        try {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();

            await savePhoto({
                storageId: storageId as Id<"_storage">,
                alt: file.name.split('.')[0],
                order: (photos?.length || 0) + 1,
            });

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Error al subir la imagen.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: Id<"gallery">) => {
        if (confirm('¿Estás seguro de eliminar esta foto?')) {
            await deletePhoto({ id });
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d12] text-white flex">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-12 space-y-12 overflow-y-auto h-screen">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-1">
                        <h2 className="text-5xl font-black uppercase italic tracking-tighter">Gestión de <span className="neon-text-pink">Galería</span></h2>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Contenido Visual en Convex Storage ({photos?.length || 0}/24)</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || (photos?.length || 0) >= 24}
                            className={`px-8 py-4 font-black uppercase text-xs tracking-widest transition-all shadow-pop ${isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-white text-black hover:bg-[var(--color-neon-cyan)]'
                                }`}
                        >
                            {isUploading ? 'Subiendo...' : '+ Subir Nueva Foto'}
                        </button>
                    </div>
                </header>

                <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-10">
                    {photos?.map((img) => (
                        <div key={img._id} className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-white/10 to-transparent rounded-2xl blur-sm group-hover:from-[var(--color-neon-cyan)]/20 transition-all duration-500" />

                            <div className="relative glass-card bg-[#1a1a25]/80 border-white/10 overflow-hidden group-hover:border-[var(--color-neon-cyan)]/30 transition-all">
                                <div className="aspect-[3/4] overflow-hidden relative border-b border-white/5">
                                    <img
                                        src={img.url || ''}
                                        alt={img.alt}
                                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                    />

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => handleDelete(img._id)}
                                            className="w-12 h-12 rounded-full bg-black border border-white/20 text-white flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5 flex justify-between items-center bg-black/40">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white">{img.alt}</p>
                                        <p className="text-[8px] text-white/20 uppercase font-bold tracking-tighter">Pos: {img.order} / ID: {img._id.toString().slice(-4)}</p>
                                    </div>
                                    <div className="text-[9px] font-black italic text-[var(--color-neon-cyan)]">
                                        LIVE
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {!photos && [1, 2, 3].map(i => (
                        <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-2xl border border-white/10" />
                    ))}

                    {photos && photos.length < 24 && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative border-2 border-dashed border-white/5 rounded-2xl aspect-[3/4] flex flex-col items-center justify-center gap-4 hover:border-[var(--color-neon-cyan)]/30 transition-all bg-white/[0.02] hover:bg-white/[0.04]"
                        >
                            <span className="text-4xl text-white/20 group-hover:text-[var(--color-neon-cyan)] transition-colors">+</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">Añadir a Galería</span>
                        </button>
                    )}
                </section>
            </main>
        </div>
    );
}
