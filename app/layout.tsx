import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Fonts are loaded ONCE here via next/font and exposed as CSS variables.
 * This replaces the per-page `@import url('...Cinzel...Cormorant...')` calls
 * inside each page's <style> block (render-blocking + re-fetched per route).
 *
 * IMPORTANT: when you later refactor the pages, reference the font via the
 * variable — font-family: var(--font-cormorant) — NOT the literal name
 * 'Cormorant Garamond'. next/font generates a hashed family name, so the
 * literal string does not resolve. (This is exactly why the Navbar's
 * `'Cinzel'` was silently falling back to the default serif.)
 */
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://issotimeluxury.com"),
  title: {
    default: "ISSO TIME LUXURY — Luxury Timepieces in Algeria",
    template: "%s · ISSO TIME LUXURY",
  },
  description:
    "Curated luxury timepieces. Free delivery across Algeria, cash on delivery, and a 2-year warranty.",
  openGraph: {
    title: "ISSO TIME LUXURY",
    description: "Curated luxury timepieces in Algeria.",
    url: "https://issotimeluxury.com",
    siteName: "ISSO TIME LUXURY",
    type: "website",
  },
};

// CRITICAL for mobile: makes the browser render at device width so all
// `@media (max-width: …)` breakpoints fire. Without this, phones render the
// desktop layout squeezed down and everything looks broken.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ISSO TIME LUXURY",
    url: "https://issotimeluxury.com",
    logo: "https://issotimeluxury.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+213791285842",
      contactType: "customer service",
      areaServed: "DZ",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "DZ",
      addressLocality: "Bordj Bou Arréridj",
    },
  };

  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      {/* Background + text now come from globals.css design tokens (--bg / --text). */}
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <CartProvider>
          <WishlistProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#c9a84c] focus:text-black focus:rounded-sm"
          >
            Skip to content
          </a>
          <Navbar />
          {/*
            Navbar is `fixed` (h-20 = 80px). The home hero is meant to sit
            full-bleed underneath it, so NO global top padding is added here.
            TODO (page pass): add `pt-20` to the root of non-hero pages
            (shop, collections, product, cart, checkout) so their top content
            isn't tucked under the bar.
          */}
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}