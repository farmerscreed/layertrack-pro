import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  userRole: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return null;
      }
      
      console.log('User role fetched:', profile?.role);
      return profile?.role || null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (mounted) {
          console.log('Setting initial session:', initialSession ? 'exists' : 'null');
          setSession(initialSession);
          
          if (initialSession?.user) {
            const role = await fetchUserRole(initialSession.user.id);
            setUserRole(role);
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
          toast({
            title: "Error",
            description: "Failed to initialize authentication. Please refresh the page.",
            variant: "destructive",
          });
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession ? 'session exists' : 'no session');
      
      if (mounted) {
        setSession(currentSession);
        
        if (currentSession?.user) {
          const role = await fetchUserRole(currentSession.user.id);
          setUserRole(role);
        } else {
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  const value = {
    session,
    isLoading,
    userRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}