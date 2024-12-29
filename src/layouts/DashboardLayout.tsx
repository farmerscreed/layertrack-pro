import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-40 w-full h-16 bg-background/80 backdrop-blur-sm border-b">
            <div className="container flex items-center justify-between h-full">
              <div className="w-16 md:w-auto">
                {/* Placeholder for burger menu */}
              </div>
              <div className="flex items-center gap-2">
                {/* Action buttons will be rendered here */}
              </div>
            </div>
          </div>
          <div className="container py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;