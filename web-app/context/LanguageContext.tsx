'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    es: {
        'nav.profile': 'Profile Karla Spice',
        'nav.back': '← Volver al Sistema',
        'nav.back_profile': '← Volver al Perfil',
        'nav.dates': 'KS Citas/Dates',
        'nav.shop': 'KS Shop',
        'nav.toys': 'KS Toys',
        'nav.vip': 'VIP Club',
        'profile.title': 'DATOS',
        'profile.subtitle': 'PERSONALES',
        'profile.bio': 'Explora las características únicas que definen el ecosistema de Karla Spice. Un equilibrio entre moda, tecnología y arte.',
        'profile.gallery_btn': '📸 VER GALERÍA EXCLUSIVA',
        'profile.level_access': 'Acceso de Nivel 2',
        'profile.filtered_content': 'Contenido Filtrado',
        'profile.min_age': 'Solo para miembros registrados mayores de 18 años.',
        'profile.height': 'Altura',
        'profile.eyes': 'Ojos',
        'profile.zodiac': 'Signo',
        'profile.eyes_val': 'Café',
        'profile.zodiac_val': 'Escorpio',
        'profile.charm': 'Encanto',
        'profile.style': 'Estilo',
        'profile.energy': 'Energía',
        'profile.mystery': 'Misterio',
        'legal.title': 'RESTRICCIÓN DE EDAD Y CONSENTIMIENTO',
        'legal.p1': 'Restricción de Edad y Consentimiento: Al acceder, el usuario declara bajo juramento ser mayor de 18 años (o la mayoría de edad legal en su país) y acepta voluntariamente visualizar contenido sensual de naturaleza adulta.',
        'legal.p2': 'Propiedad Intelectual y Copyright: Todo el material (fotos, videos y textos) es propiedad exclusiva de Karla Spice Fun; queda estrictamente prohibida su reproducción, descarga, captura de pantalla o distribución total o parcial.',
        'legal.p3': 'Prohibición de Redistribución y Sanciones: El uso de este contenido fuera de la plataforma constituye una violación federal de derechos de autor, facultando a la administración para ejercer acciones legales civiles y penales contra el infractor.',
        'legal.checkbox': 'Declaro bajo juramento ser mayor de 18 años y acepto los términos.',
        'legal.btn': 'VER GALERÍA ⚡',
        'shop.title': 'KS / SHOP',
        'shop.cart_btn': 'Añadir al Carrito',
        'shop.checkout': 'PROCESAR PAGO',
        'shop.cancel': 'Cancelar',
        'shop.payment_for': 'Método de pago para:',
        'shop.confirm': 'Confirmar Pedido',
        'cart.title': 'TU CARRITO',
        'cart.empty': 'Tu carrito está vacío',
        'cart.items': 'Productos',
        'cart.total': 'Total a Pagar',
        'cart.checkout': 'Finalizar Compra',
        'cart.add': 'Añadido',
        'gallery.title': 'GALERÍA',
        'gallery.subtitle': 'EXCLUSIVA',
        'gallery.buy_hd': 'COMPRAR HD ⚡',
        'dates.title': 'AGENDAR CITA',
        'dates.subtitle': 'BOOKING',
        'dates.step1': '1. Seleccionar Fecha',
        'dates.step2': '2. Hora de Inicio (24h)',
        'dates.step3': '3. Duración de la Cita',
        'dates.step4': '4. Notas Especiales',
        'dates.duration.30m': 'Cita de 30 min',
        'dates.duration.1h': 'Cita de 1 Hora',
        'dates.duration.2h': 'Cita de 2 Horas',
        'dates.duration.4h': 'Cita de 4 Horas',
        'dates.duration.8h': 'Cita de 8 Horas',
        'dates.duration.10h': 'Cita de 10 Horas',
        'dates.duration.12h': 'Cita de 12 Horas',
        'dates.duration.weekend': 'Fin de Semana Completo',
        'dates.btn': 'SOLICITAR CITA ⚡',
        'dates.status': 'Sujeto a aprobación por Karla Spice',
        'dates.success': '¡Solicitud Enviada!',
        'dates.success_desc': 'Karla ha recibido tu petición para el día {date} a las {time}.',
    },
    en: {
        'nav.profile': 'Karla Spice Profile',
        'nav.back': '← Back to System',
        'nav.back_profile': '← Back to Profile',
        'nav.dates': 'KS Citas/Dates',
        'nav.shop': 'KS Shop',
        'nav.toys': 'KS Toys',
        'nav.vip': 'VIP Club',
        'profile.title': 'PERSONAL',
        'profile.subtitle': 'DATA',
        'profile.bio': 'Explore the unique characteristics that define the Karla Spice ecosystem. A balance between fashion, technology, and art.',
        'profile.gallery_btn': '📸 VIEW EXCLUSIVE GALLERY',
        'profile.level_access': 'Level 2 Access',
        'profile.filtered_content': 'Filtered Content',
        'profile.min_age': 'Only for registered members over 18 years old.',
        'profile.height': 'Height',
        'profile.eyes': 'Eyes',
        'profile.zodiac': 'Zodiac',
        'profile.eyes_val': 'Brown',
        'profile.zodiac_val': 'Scorpio',
        'profile.charm': 'Charm',
        'profile.style': 'Style',
        'profile.energy': 'Energy',
        'profile.mystery': 'Mystery',
        'legal.title': 'AGE RESTRICTION AND CONSENT',
        'legal.p1': 'Age Restriction and Consent: By accessing, the user declares under oath to be over 18 years old (or the legal age of majority in their country) and voluntarily accepts to view sensual adult content.',
        'legal.p2': 'Intellectual Property and Copyright: All material (photos, videos, and texts) is the exclusive property of Karla Spice Fun; its reproduction, download, screenshot, or total or partial distribution is strictly prohibited.',
        'legal.p3': 'Prohibición de Redistribución y Sanciones: El use of this content outside the platform constitutes a federal copyright violation, empowering the administration to take civil and criminal legal action against the offender.',
        'legal.checkbox': 'I declare under oath that I am over 18 years old and I accept the terms.',
        'legal.btn': 'VIEW GALLERY ⚡',
        'shop.title': 'KS / SHOP',
        'shop.cart_btn': 'Add to Cart',
        'shop.checkout': 'PROCESS PAYMENT',
        'shop.cancel': 'Cancel',
        'shop.payment_for': 'Payment method for:',
        'shop.confirm': 'Confirm Order',
        'cart.title': 'YOUR CART',
        'cart.empty': 'Your cart is empty',
        'cart.items': 'Items',
        'cart.total': 'Total to Pay',
        'cart.checkout': 'Proceed to Checkout',
        'cart.add': 'Added',
        'gallery.title': 'EXCLUSIVE',
        'gallery.subtitle': 'GALLERY',
        'gallery.buy_hd': 'BUY HD ⚡',
        'dates.title': 'BOOK APPOINTMENT',
        'dates.subtitle': 'BOOKING',
        'dates.step1': '1. Select Date',
        'dates.step2': '2. Starting Time (24h)',
        'dates.step3': '3. Appointment Duration',
        'dates.step4': '4. Special Notes',
        'dates.duration.30m': '30 min Appointment',
        'dates.duration.1h': '1 Hour Appointment',
        'dates.duration.2h': '2 Hours Appointment',
        'dates.duration.4h': '4 Hours Appointment',
        'dates.duration.8h': '8-Hour Appointment',
        'dates.duration.10h': '10-Hour Appointment',
        'dates.duration.12h': '12-Hour Appointment',
        'dates.duration.weekend': 'Full Weekend Accompaniment',
        'dates.btn': 'REQUEST APPOINTMENT ⚡',
        'dates.status': 'Subject to Karla Spice approval',
        'dates.success': 'Request Sent!',
        'dates.success_desc': 'Karla has received your request for {date} at {time}.',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('es');

    useEffect(() => {
        const savedLang = localStorage.getItem('ks-language') as Language;
        if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('ks-language', lang);
    };

    const t = (key: string) => {
        return translations[language][key as keyof typeof translations['es']] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
}
