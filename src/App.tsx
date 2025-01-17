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

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', savedDarkMode);

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (!session) {
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
        }

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error('Profile error:', profileError);
            if (mounted) {
              setUserRole(null);
              setIsLoading(false);
            }
            return;
          }

          if (mounted) {
            setUserRole(profile?.role || null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setUserRole(null);
          setIsLoading(false);
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Profile error:', profileError);
          if (mounted) {
            setUserRole(null);
          }
          return;
        }

        if (mounted) {
          setUserRole(profile?.role || null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (mounted) {
          setUserRole(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
    let mounted = true;

    const initializeSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setInitialSession(session);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setInitialSession(session);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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