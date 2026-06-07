import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { getSettings } from "@/lib/repositories";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Header
        websiteName={settings.websiteName}
        logo={settings.logo || "/Image/logo.svg"}
      />
      <main className="flex-1">{children}</main>
      <Footer
        websiteName={settings.websiteName}
        footerText={settings.footerText}
        footerLinks={settings.footerLinks}
      />
    </>
  );
}
