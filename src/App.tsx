import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
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

// Define route access based on roles
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

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', savedDarkMode);

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(!!session);

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile error:', profileError);
            setUserRole(null);
          } else {
            setUserRole(profile?.role || null);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setUserRole(profile?.role || null);
      } else {
        setUserRole(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles.length > 0 && (!userRole || !requiredRoles.includes(userRole))) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const App = () => {
  const [initialSession, setInitialSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setInitialSession(session);
      setIsLoading(false);
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setInitialSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider 
        supabaseClient={supabase}
        initialSession={initialSession}
      >
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
          </TooltipProvider>
        </CurrencyProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;