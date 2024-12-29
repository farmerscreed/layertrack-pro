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
          <div className="sticky top-0 z-40 w-full h-16 bg-background/80 backdrop-blur-sm border-b border-border/40">
            <div className="container flex items-center justify-between h-full">
              <div className="w-16 md:w-auto">
                {/* Placeholder for burger menu */}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  Welcome, <span className="font-semibold">{session?.user?.email}</span>
                </div>
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