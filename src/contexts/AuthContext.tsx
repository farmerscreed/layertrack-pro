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

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast({
            title: "Authentication Error",
            description: "There was a problem with your session. Please try logging in again.",
            variant: "destructive",
          });
          return;
        }

        if (mounted) {
          setSession(initialSession);
          
          if (initialSession?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', initialSession.user.id)
              .maybeSingle();
            
            setUserRole(profile?.role || null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      console.log('Auth state changed:', event);
      setSession(currentSession);

      if (currentSession?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .maybeSingle();
        
        setUserRole(profile?.role || null);
      } else {
        setUserRole(null);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, userRole }}>
      {children}
    </AuthContext.Provider>
  );
}