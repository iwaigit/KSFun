import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  robots: "noindex, nofollow",
};

import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import UniversalCart from "@/components/UniversalCart";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtener headers del middleware (tenant detection)
  const headersList = headers();
  const tenantSlug = headersList.get('x-tenant-slug') || 'default';
  const tenantDetection = headersList.get('x-tenant-detection') || 'fallback';
  
  return (
    <html lang="es">
      <head>
        {/* Inyectar tenant info para que useTenant() lo lea en cliente */}
        <meta name="x-tenant-slug" content={tenantSlug} />
        <meta name="x-tenant-detection" content={tenantDetection} />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`} style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
        <ConvexClientProvider>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <UniversalCart />
                <footer style={{
                  textAlign: 'center',
                  padding: '12px',
                  fontSize: '11px',
                  color: '#666',
                  borderTop: '1px solid #1a1a1a',
                }}>
                  2026 Zynch by iwai — Powered by{' '}
                  <a href="https://www.iwai.work" target="_blank" rel="noopener noreferrer" style={{ color: '#666', textDecoration: 'none', fontWeight: 'bold' }}>
                    IWAI - Automated Processes
                  </a>
                </footer>
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}