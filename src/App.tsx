import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Batches from "./pages/dashboard/batches";
import Production from "./pages/dashboard/production";
import Health from "./pages/dashboard/health";
import Feed from "./pages/dashboard/feed";
import Finance from "./pages/dashboard/finance";
import Staff from "./pages/dashboard/staff";
import Settings from "./pages/dashboard/settings";
import Analytics from "./pages/dashboard/analytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const routeAccess = {
  "/dashboard": ["admin", "manager", "worker"],
  "/dashboard/batches": ["admin", "manager", "worker"],
  "/dashboard/production": ["admin", "manager", "worker"],
  "/dashboard/health": ["admin", "manager", "worker"],
  "/dashboard/feed": ["admin", "manager", "worker"],
  "/dashboard/finance": ["admin", "manager"],
  "/dashboard/staff": ["admin"],
  "/dashboard/settings": ["admin"],
  "/dashboard/analytics": ["admin", "manager"],
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
        }
        // Even if there's an error, we want to stop loading
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRoles={routeAccess["/dashboard"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route 
            path="batches" 
            element={
              <ProtectedRoute requiredRoles={routeAccess["/dashboard/batches"]}>
                <Batches />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="production" 
            element={
              <ProtectedRoute requiredRoles={routeAccess["/dashboard/production"]}>
                <Production />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="health" 
            element={
              <ProtectedRoute requiredRoles={routeAccess["/dashboard/health"]}>
                <Health />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="feed" 
            element={
              <ProtectedRoute requiredRoles={routeAccess["/dashboard/feed"]}>
                <Feed />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="finance" 
            element={
              <ProtectedRoute requiredRoles={routeAccess["/dashboard/finance"]}>
                <Finance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="staff" 
            element={
              <ProtectedRoute requiredRoles={routeAccess["/dashboard/staff"]}>
                <Staff />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute requiredRoles={routeAccess["/dashboard/settings"]}>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="analytics" 
            element={
              <ProtectedRoute requiredRoles={routeAccess["/dashboard/analytics"]}>
                <Analytics />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <AuthProvider>
          <CurrencyProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
          </CurrencyProvider>
        </AuthProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;