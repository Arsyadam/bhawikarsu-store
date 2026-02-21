import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo_Black, Space_Grotesk, Caveat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-archivo-black",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bhawikarsu Store",
  description: "Official B96 Merchandise",
  icons: {
    icon: "/B.96.svg",
  }
};

import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivoBlack.variable} ${spaceGrotesk.variable} ${caveat.variable} antialiased`}
        suppressHydrationWarning
      >
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster position="top-center" expand={true} richColors />
      </body>
    </html>
  );
}
