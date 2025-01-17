import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';

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
  const { toast } = useToast();
  
  const { data: profile, isLoading: isLoadingProfile } = useProfile(session);
  
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
          if (initialSession?.user) {
            console.log('Setting initial session:', initialSession.user.email);
            setSession(initialSession);
          } else {
            console.log('No initial session found');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          toast({
            title: "Error",
            description: "Failed to initialize authentication. Please refresh the page.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession ? 'session exists' : 'no session');
      
      if (mounted) {
        setSession(currentSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  const value = {
    session,
    isLoading: isLoading || isLoadingProfile,
    userRole: profile?.role || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}