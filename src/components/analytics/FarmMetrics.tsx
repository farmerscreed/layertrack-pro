import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";

interface MetricData {
  date: string;
  feedConsumption: number;
  mortalityRate: number;
}

const fetchMetrics = async (userId: string) => {
  // Fetch feed consumption data
  const { data: feedData } = await supabase
    .from('feed_inventory')
    .select('purchase_date, quantity_kg')
    .eq('user_id', userId)
    .order('purchase_date', { ascending: true });

  // Fetch mortality data from batch performance
  const { data: mortalityData } = await supabase
    .from('batch_performance')
    .select('created_at, mortality_rate, batch_id')
    .order('created_at', { ascending: true });

  // Combine and format the data
  const combinedData: MetricData[] = [];
  
  // Process feed data
  feedData?.forEach(feed => {
    combinedData.push({
      date: new Date(feed.purchase_date).toLocaleDateString(),
      feedConsumption: Number(feed.quantity_kg),
      mortalityRate: 0
    });
  });

  // Process mortality data
  mortalityData?.forEach(mortality => {
    if (mortality.mortality_rate) {
      combinedData.push({
        date: new Date(mortality.created_at).toLocaleDateString(),
        feedConsumption: 0,
        mortalityRate: Number(mortality.mortality_rate)
      });
    }
  });

  // Sort by date
  return combinedData.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const FarmMetrics = () => {
  const session = useSession();

  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['farm-metrics', session?.user.id],
    queryFn: () => fetchMetrics(session?.user.id || ''),
    enabled: !!session?.user.id,
  });

  if (isLoading) return <div>Loading metrics...</div>;
  if (error) return <div>Error loading metrics</div>;

  return (
    <Card className="col-span-2 bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Farm Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-[300px]"
          config={{
            feedConsumption: {
              label: "Feed Consumption (kg)",
              theme: {
                light: "#22c55e",
                dark: "#22c55e",
              },
            },
            mortalityRate: {
              label: "Mortality Rate (%)",
              theme: {
                light: "#ef4444",
                dark: "#ef4444",
              },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="feedConsumption"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.2}
                className="animate-in fade-in duration-1000"
              />
              <Area
                type="monotone"
                dataKey="mortalityRate"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.2}
                className="animate-in fade-in duration-1000 delay-300"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};