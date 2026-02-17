import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Usando Outfit para un toque más Pop/Moderno
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karla Spice Fun | Official Site",
  description: "Explora la galería exclusiva de Karla Spice, su tienda de lencería y mucho más.",
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
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable}`} style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
        <ConvexClientProvider>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <UniversalCart />
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
