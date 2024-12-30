import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Outlet } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

const DashboardLayout = () => {
  const session = useSession();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-background/95">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b border-border/40">
            <div className="container flex flex-col md:flex-row items-start md:items-center justify-between py-4 md:h-16 gap-2">
              <div className="w-full md:w-auto order-2 md:order-1">
                <div className="text-sm">
                  Welcome, <span className="font-semibold">{session?.user?.email}</span>
                </div>
              </div>
              <div className="flex items-center w-full md:w-auto justify-between md:justify-end gap-4 order-1 md:order-2">
                {/* Action buttons will be rendered here by child components */}
              </div>
            </div>
          </div>
          <div className="container py-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;