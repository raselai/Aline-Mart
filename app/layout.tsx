import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
  title: "Aline Mart - Luxury Multi-Brand Marketplace",
  description: "Discover luxury fashion from the world's most prestigious brands. Curated collections for the discerning shopper.",
  keywords: ["luxury fashion", "designer brands", "premium shopping", "high-end clothing"],
  authors: [{ name: "Aline Mart" }],
  openGraph: {
    title: "Aline Mart - Luxury Multi-Brand Marketplace",
    description: "Discover luxury fashion from the world's most prestigious brands.",
    type: "website",
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
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
