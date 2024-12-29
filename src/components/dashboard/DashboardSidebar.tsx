import {
  BarChart3,
  Bird,
  Egg,
  Heart,
  Home,
  Menu,
  Settings as SettingsIcon,
  ShoppingCart,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const menuItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Batches",
    url: "/dashboard/batches",
    icon: Bird,
  },
  {
    title: "Production",
    url: "/dashboard/production",
    icon: Egg,
  },
  {
    title: "Health",
    url: "/dashboard/health",
    icon: Heart,
  },
  {
    title: "Feed",
    url: "/dashboard/feed",
    icon: ShoppingCart,
  },
  {
    title: "Finance",
    url: "/dashboard/finance",
    icon: Wallet,
  },
  {
    title: "Staff",
    url: "/dashboard/staff",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: SettingsIcon,
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const MenuContent = () => (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.url}
                  onClick={() => setIsOpen(false)}
                >
                  <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );

  return (
    <>
      {/* Mobile Menu */}
      <div className="fixed top-6 left-4 z-50 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              {isOpen ? (
                <X className="h-5 w-5 text-primary" />
              ) : (
                <Menu className="h-5 w-5 text-primary" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] bg-gradient-to-br from-primary/5 via-background to-secondary/5 backdrop-blur-xl border-r border-white/10 p-0"
          >
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                  Farm Manager
                </h2>
              </div>
              <MenuContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar className="border-r border-white/10 bg-gradient-to-br from-primary/5 via-background to-secondary/5 backdrop-blur-xl">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              Farm Manager
            </h2>
          </div>
          <MenuContent />
        </Sidebar>
      </div>
    </>
  );
}