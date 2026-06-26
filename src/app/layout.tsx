import type { Metadata } from "next";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import { CartProvider } from "@/hooks/useCart";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Website",
  description: "Your Website Description",
  other: {
    enamad: "25866399",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}