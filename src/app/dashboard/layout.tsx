import { Header } from "@/components/shop/Header";
import { UserSidebar } from "@/components/dashboard/UserSidebar";
import { getSettings } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
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
      <div className="flex min-h-screen">
        <UserSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </>
  );
}
