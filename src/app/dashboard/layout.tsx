import { UserSidebar } from "@/components/dashboard/UserSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
