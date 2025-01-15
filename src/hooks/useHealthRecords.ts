import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface HealthRecord {
  id: string;
  batch_id: string;
  record_date: string;
  record_type: string;
  description: string;
  cost?: number;
  notes?: string;
  created_at: string;
}

export interface VaccinationSchedule {
  id: string;
  batch_id: string;
  vaccine_name: string;
  scheduled_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export const useHealthRecords = (batchId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch health records
  const healthRecords = useQuery({
    queryKey: ['healthRecords', batchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('batch_id', batchId)
        .order('record_date', { ascending: false });

      if (error) throw error;
      return data as HealthRecord[];
    },
  });

  // Fetch vaccination schedules
  const vaccinationSchedules = useQuery({
    queryKey: ['vaccinationSchedules', batchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vaccination_schedules')
        .select('*')
        .eq('batch_id', batchId)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data as VaccinationSchedule[];
    },
  });

  // Add health record
  const addHealthRecord = useMutation({
    mutationFn: async (record: Omit<HealthRecord, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('health_records')
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthRecords', batchId] });
      toast({
        title: "Health record added",
        description: "The health record has been successfully added.",
      });
    },
  });

  // Add vaccination schedule
  const addVaccinationSchedule = useMutation({
    mutationFn: async (schedule: Omit<VaccinationSchedule, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('vaccination_schedules')
        .insert(schedule)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinationSchedules', batchId] });
      toast({
        title: "Vaccination scheduled",
        description: "The vaccination has been successfully scheduled.",
      });
    },
  });

  // Update vaccination status
  const updateVaccinationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: VaccinationSchedule['status'] }) => {
      const { data, error } = await supabase
        .from('vaccination_schedules')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinationSchedules', batchId] });
      toast({
        title: "Status updated",
        description: "The vaccination status has been updated.",
      });
    },
  });

  return {
    healthRecords,
    vaccinationSchedules,
    addHealthRecord,
    addVaccinationSchedule,
    updateVaccinationStatus,
  };
};