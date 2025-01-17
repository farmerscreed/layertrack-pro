import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/auth-helpers-react";

export const useProfile = (session: Session | null) => {
  return useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      console.log('Fetching profile for:', session.user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name, avatar_url, currency_preference')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
      
      console.log('Profile data:', data);
      return data;
    },
    enabled: !!session?.user?.id,
  });
};