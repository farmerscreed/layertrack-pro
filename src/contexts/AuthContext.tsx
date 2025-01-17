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

    async function getInitialSession() {
      try {
        console.log('Getting initial session...');
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            toast({
              title: "Authentication Error",
              description: "There was a problem with your session. Please try logging in again.",
              variant: "destructive",
            });
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          console.log('Initial session:', initialSession ? 'exists' : 'null');
          setSession(initialSession);
          
          if (initialSession?.user) {
            console.log('Fetching user role for:', initialSession.user.id);
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', initialSession.user.id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Profile fetch error:', profileError);
            } else {
              console.log('User role:', profile?.role);
              setUserRole(profile?.role || null);
            }
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
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession ? 'session exists' : 'no session');
      
      if (mounted) {
        setSession(currentSession);
        
        if (currentSession?.user) {
          console.log('Fetching updated user role');
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentSession.user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error('Profile fetch error on auth change:', profileError);
          } else {
            setUserRole(profile?.role || null);
          }
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

  return (
    <AuthContext.Provider value={{ session, isLoading, userRole }}>
      {children}
    </AuthContext.Provider>
  );
}