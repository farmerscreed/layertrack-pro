import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formSchema } from "./EggCollectionForm";
import { z } from "zod";

export const useEggCollection = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  const fetchBatches = async (userId: string) => {
    const { data, error } = await supabase
      .from('batches')
      .select('id, name')
      .eq('user_id', userId)
      .eq('status', 'active');
    
    if (error) throw error;
    return data;
  };

  const fetchStaff = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name');
    
    if (error) throw error;
    return data;
  };

  const { data: batches, isLoading: batchesLoading } = useQuery({
    queryKey: ['batches', session?.user?.id],
    queryFn: () => fetchBatches(session?.user?.id || ''),
    enabled: !!session?.user?.id,
  });

  const { data: staff, isLoading: staffLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => fetchStaff(session?.user?.id || ''),
    enabled: !!session?.user?.id,
  });

  const addEggCollection = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase
        .from('egg_production')
        .insert({
          batch_id: values.batchId,
          collection_date: values.date,
          quantity: values.totalEggs,
          damaged: values.damaged,
          notes: `Grade A: ${values.gradeA}, Grade B: ${values.gradeB}, Collected by: ${values.collectedBy}`,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['egg-production'] });
    },
  });

  return {
    batches,
    staff,
    isLoading: batchesLoading || staffLoading,
    addEggCollection,
  };
};