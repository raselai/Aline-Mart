import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://alinemart.com'),
  title: {
    default: "Aline Mart - Luxury Multi-Brand Marketplace",
    template: "%s | Aline Mart",
  },
  description: "Discover luxury fashion from the world's most prestigious brands. Shop curated collections of designer clothing, accessories, and more at Aline Mart — Bangladesh's premier luxury marketplace.",
  keywords: ["luxury fashion", "designer brands", "premium shopping", "high-end clothing", "luxury marketplace Bangladesh", "designer clothing online", "Aline Mart"],
  authors: [{ name: "Aline Mart" }],
  creator: "Aline Mart",
  publisher: "Aline Mart",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Aline Mart - Luxury Multi-Brand Marketplace",
    description: "Discover luxury fashion from the world's most prestigious brands. Shop curated collections at Bangladesh's premier luxury marketplace.",
    type: "website",
    siteName: "Aline Mart",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aline Mart - Luxury Multi-Brand Marketplace",
    description: "Discover luxury fashion from the world's most prestigious brands.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
