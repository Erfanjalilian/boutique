import type { Metadata } from "next";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import { CartProvider } from "@/hooks/useCart";
import { getSettings } from "@/lib/repositories";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
    icons: { icon: settings.favicon || "/Image/logo.svg" },
  };
}

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
