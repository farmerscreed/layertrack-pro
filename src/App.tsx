import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { useEffect, useState } from "react";
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

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', savedDarkMode);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="batches" element={<Batches />} />
                <Route path="production" element={<Production />} />
                <Route path="health" element={<Health />} />
                <Route path="feed" element={<Feed />} />
                <Route path="finance" element={<Finance />} />
                <Route path="staff" element={<Staff />} />
                <Route path="settings" element={<Settings />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;