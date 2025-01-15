import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useBatchManagement = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: batches, isLoading: isLoadingBatches } = useQuery({
    queryKey: ['batches', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batches')
        .select(`
          *,
          batch_performance!batch_performance_batch_id_fkey (
            feed_conversion_ratio,
            mortality_rate,
            average_weight,
            production_rate
          ),
          egg_production (
            quantity,
            damaged,
            collection_date
          )
        `)
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const addBatch = useMutation({
    mutationFn: async (values: {
      name: string;
      quantity: number;
      breed?: string;
      arrival_date: string;
      cost_per_bird: number;
      age_at_purchase: number;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('batches')
        .insert([
          {
            ...values,
            user_id: session?.user?.id,
            status: 'active',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast({
        title: "Success",
        description: "Batch added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateBatch = useMutation({
    mutationFn: async (values: {
      id: string;
      name?: string;
      quantity?: number;
      breed?: string;
      notes?: string;
      status?: string;
      cost_per_bird?: number;
      age_at_purchase?: number;
    }) => {
      const { id, ...updateData } = values;
      const { data, error } = await supabase
        .from('batches')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast({
        title: "Success",
        description: "Batch updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteBatch = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('batches')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast({
        title: "Success",
        description: "Batch deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    batches,
    isLoadingBatches,
    addBatch,
    updateBatch,
    deleteBatch,
  };
};