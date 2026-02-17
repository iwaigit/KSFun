'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

const PRODUCTS = [
    { id: '1', name: 'Conjunto Sakura Neon', priceUSD: 45, category: 'Lencería', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=400&auto=format&fit=crop', desc: 'Seda premium con detalles fluorescentes.' },
    { id: '2', name: 'Vibrador CyberPulse', priceUSD: 80, category: 'Toys', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop', desc: 'Alta tecnología para sensaciones profundas.' },
    { id: '3', name: 'Corset Arasaka Style', priceUSD: 120, category: 'Lencería', image: 'https://images.unsplash.com/photo-1616150244439-49740f9012c8?q=80&w=400&auto=format&fit=crop', desc: 'Diseño anatómico con herrajes de titanio.' },
    { id: '4', name: 'Aceite Esencial Zenión', priceUSD: 25, category: 'Toys', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400&auto=format&fit=crop', desc: 'Aromas futuristas para relajación total.' },
];

export default function Shop() {
    const { t, language } = useLanguage();
    const { addToCart, cart } = useCart();
    const [currency, setCurrency] = useState<'USD' | 'VES'>('USD');
    const [exchangeRate] = useState(60);

    const formatPrice = (usd: number) => {
        if (currency === 'USD') return `$${usd}`;
        return `Bs. ${(usd * exchangeRate).toLocaleString()}`;
    };

    return (
        <div className="space-y-12 py-10">
            {/* Header with Currency Toggle */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter neon-text-cyan leading-none text-center md:text-left">
                        KS <span className="text-white opacity-20">/</span> SHOP
                    </h2>
                    <div className="h-0.5 w-16 bg-[var(--color-neon-cyan)] shadow-[0_0_10px_var(--color-neon-cyan)] mx-auto md:mx-0" />
                </div>

                <div className="flex bg-white/5 p-1 rounded-full border border-white/10 glass-card">
                    <button
                        onClick={() => setCurrency('USD')}
                        className={`px-5 py-2 rounded-full font-black text-[10px] transition-all ${currency === 'USD' ? 'bg-[var(--color-neon-cyan)] text-black shadow-[0_0_10px_rgba(0,243,255,0.4)]' : 'text-white/40'}`}
                    >
                        USD ($)
                    </button>
                    <button
                        onClick={() => setCurrency('VES')}
                        className={`px-5 py-2 rounded-full font-black text-[10px] transition-all ${currency === 'VES' ? 'bg-[var(--color-neon-cyan)] text-black shadow-[0_0_10px_rgba(0,243,255,0.4)]' : 'text-white/40'}`}
                    >
                        VES (Bs)
                    </button>
                </div>
            </header>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRODUCTS.map((product) => (
                    <div key={product.id} className="glass-card group flex flex-col border-white/5 hover:border-[var(--color-neon-cyan)] transition-all duration-500 overflow-hidden">
                        <div className="aspect-square relative overflow-hidden bg-[#1a1a25]">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 border-l border-[var(--color-neon-cyan)] text-[8px] font-black uppercase tracking-widest text-white">
                                {product.category === 'Lencería' ? (language === 'es' ? 'Lencería' : 'Lingerie') : product.category}
                            </div>
                        </div>

                        <div className="p-6 space-y-3 flex-1 flex flex-col">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-black uppercase text-base tracking-tighter italic group-hover:neon-text-cyan transition-colors">{product.name}</h3>
                                <span className="text-lg font-bold neon-text-yellow">{formatPrice(product.priceUSD)}</span>
                            </div>
                            <p className="text-xs font-bold text-white/40 flex-1 leading-relaxed line-clamp-2">
                                {language === 'es' ? product.desc : (
                                    product.id === '1' ? 'Premium silk with fluorescent details.' :
                                        product.id === '2' ? 'High technology for deep sensations.' :
                                            product.id === '3' ? 'Anatomic design with titanium fittings.' :
                                                product.id === '4' ? 'Futuristic scents for total relaxation.' : product.desc
                                )}
                            </p>

                            <button
                                onClick={() => addToCart({
                                    id: product.id,
                                    type: 'product',
                                    name: product.name,
                                    priceUSD: product.priceUSD,
                                    image: product.image
                                })}
                                className={`
                                    glass-card w-full border border-[var(--color-neon-cyan)]/30 
                                    hover:border-[var(--color-neon-cyan)] hover:shadow-[0_0_15px_rgba(0,243,255,0.4)]
                                    hover:-translate-y-1 active:scale-95 transition-all duration-300
                                    mt-4 py-2.5 font-black uppercase tracking-[0.2em] text-[10px] text-white
                                `}
                            >
                                {cart.find(item => item.id === product.id) ? `${t('cart.add')} (${cart.find(item => item.id === product.id)?.quantity})` : t('shop.cart_btn')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
