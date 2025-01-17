import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function BatchComparison() {
  const { data: batches, isLoading } = useQuery({
    queryKey: ['batches-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batches')
        .select(`
          id,
          name,
          batch_performance!batch_performance_batch_id_fkey (
            feed_conversion_ratio,
            mortality_rate,
            average_weight,
            production_rate,
            industry_standard_fcr,
            industry_standard_mortality,
            industry_standard_weight,
            industry_standard_production,
            benchmark_batch_id
          )
        `)
        .eq('status', 'active')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Batch Comparison</h1>
      <ul>
        {batches.map(batch => (
          <li key={batch.id}>{batch.name}</li>
        ))}
      </ul>
    </div>
  );
}
