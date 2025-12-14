import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/providers/StoreProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TISA Speed Reader",
  description: "Activate Your Super Eyes! A gamified speed reading training app for kids.",
  keywords: ["speed reading", "kids", "education", "reading practice", "TISA"],
  authors: [{ name: "TISA International School" }],
  openGraph: {
    title: "TISA Speed Reader",
    description: "Activate Your Super Eyes! Train your reading speed with fun exercises.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FAF8F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} antialiased`}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
