import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface BatchMetrics {
  batchName: string;
  feedConversion: number;
  mortalityRate: number;
  avgWeight: number;
  productionRate: number;
  industryFCR?: number;
  industryMortality?: number;
  industryWeight?: number;
  industryProduction?: number;
  benchmarkFCR?: number;
  benchmarkMortality?: number;
  benchmarkWeight?: number;
  benchmarkProduction?: number;
}

const fetchBatchMetrics = async (userId: string, benchmarkBatchId?: string) => {
  const { data: batches, error: batchError } = await supabase
    .from('batches')
    .select(`
      id,
      name,
      batch_performance (
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
    .eq('user_id', userId)
    .eq('status', 'active');

  if (batchError) throw batchError;

  let benchmarkMetrics = null;
  if (benchmarkBatchId) {
    const { data: benchmarkData } = await supabase
      .from('batch_performance')
      .select('*')
      .eq('batch_id', benchmarkBatchId)
      .single();
    benchmarkMetrics = benchmarkData;
  }

  return batches.map(batch => ({
    batchName: batch.name,
    feedConversion: batch.batch_performance?.[0]?.feed_conversion_ratio || 0,
    mortalityRate: batch.batch_performance?.[0]?.mortality_rate || 0,
    avgWeight: batch.batch_performance?.[0]?.average_weight || 0,
    productionRate: batch.batch_performance?.[0]?.production_rate || 0,
    industryFCR: batch.batch_performance?.[0]?.industry_standard_fcr,
    industryMortality: batch.batch_performance?.[0]?.industry_standard_mortality,
    industryWeight: batch.batch_performance?.[0]?.industry_standard_weight,
    industryProduction: batch.batch_performance?.[0]?.industry_standard_production,
    benchmarkFCR: benchmarkMetrics?.feed_conversion_ratio,
    benchmarkMortality: benchmarkMetrics?.mortality_rate,
    benchmarkWeight: benchmarkMetrics?.average_weight,
    benchmarkProduction: benchmarkMetrics?.production_rate,
  }));
};

export const BatchComparison = () => {
  const session = useSession();
  const [showIndustryStandards, setShowIndustryStandards] = useState(false);
  const [benchmarkBatchId, setBenchmarkBatchId] = useState<string>();

  const { data: availableBatches } = useQuery({
    queryKey: ['available-batches', session?.user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('batches')
        .select('id, name')
        .eq('user_id', session?.user.id)
        .eq('status', 'completed');
      return data || [];
    },
    enabled: !!session?.user.id,
  });

  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['batch-metrics', session?.user.id, benchmarkBatchId],
    queryFn: () => fetchBatchMetrics(session?.user.id || '', benchmarkBatchId),
    enabled: !!session?.user.id,
  });

  if (isLoading) return <div>Loading batch comparisons...</div>;
  if (error) return <div>Error loading batch comparisons</div>;
  if (!metrics?.length) return <div>No batch data available</div>;

  return (
    <Card className="col-span-2 bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Batch Performance Comparison
        </CardTitle>
        <div className="flex items-center gap-4">
          <Select value={benchmarkBatchId} onValueChange={setBenchmarkBatchId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select benchmark batch" />
            </SelectTrigger>
            <SelectContent>
              {availableBatches?.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIndustryStandards(!showIndustryStandards)}
          >
            {showIndustryStandards ? 'Hide' : 'Show'} Industry Standards
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {benchmarkBatchId && (
          <div className="mb-4 flex gap-2 flex-wrap">
            <Badge variant="outline" className="bg-[#22c55e]/10">
              Benchmark FCR: {metrics[0]?.benchmarkFCR?.toFixed(2)}
            </Badge>
            <Badge variant="outline" className="bg-[#ef4444]/10">
              Benchmark Mortality: {metrics[0]?.benchmarkMortality?.toFixed(2)}%
            </Badge>
            <Badge variant="outline" className="bg-[#3b82f6]/10">
              Benchmark Production: {metrics[0]?.benchmarkProduction?.toFixed(2)}%
            </Badge>
            <Badge variant="outline" className="bg-[#f59e0b]/10">
              Benchmark Weight: {metrics[0]?.benchmarkWeight?.toFixed(2)} kg
            </Badge>
          </div>
        )}
        <ChartContainer
          className="h-[300px]"
          config={{
            feedConversion: {
              label: "Feed Conversion Ratio",
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
            productionRate: {
              label: "Production Rate (%)",
              theme: {
                light: "#3b82f6",
                dark: "#3b82f6",
              },
            },
            avgWeight: {
              label: "Average Weight (kg)",
              theme: {
                light: "#f59e0b",
                dark: "#f59e0b",
              },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics} barGap={0} barCategoryGap={30}>
              <XAxis
                dataKey="batchName"
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
              <Legend />
              <Bar
                dataKey="feedConversion"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                className="animate-in fade-in duration-1000"
              />
              <Bar
                dataKey="mortalityRate"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                className="animate-in fade-in duration-1000 delay-100"
              />
              <Bar
                dataKey="productionRate"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                className="animate-in fade-in duration-1000 delay-200"
              />
              <Bar
                dataKey="avgWeight"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                className="animate-in fade-in duration-1000 delay-300"
              />
              {showIndustryStandards && (
                <>
                  <ReferenceLine
                    y={metrics[0]?.industryFCR}
                    stroke="#22c55e"
                    strokeDasharray="3 3"
                    label={{ value: 'Industry FCR', position: 'right' }}
                  />
                  <ReferenceLine
                    y={metrics[0]?.industryMortality}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label={{ value: 'Industry Mortality', position: 'right' }}
                  />
                  <ReferenceLine
                    y={metrics[0]?.industryProduction}
                    stroke="#3b82f6"
                    strokeDasharray="3 3"
                    label={{ value: 'Industry Production', position: 'right' }}
                  />
                  <ReferenceLine
                    y={metrics[0]?.industryWeight}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{ value: 'Industry Weight', position: 'right' }}
                  />
                </>
              )}
              {benchmarkBatchId && (
                <>
                  <ReferenceLine
                    y={metrics[0]?.benchmarkFCR}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    label={{ value: 'Benchmark FCR', position: 'left' }}
                  />
                  <ReferenceLine
                    y={metrics[0]?.benchmarkMortality}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    label={{ value: 'Benchmark Mortality', position: 'left' }}
                  />
                  <ReferenceLine
                    y={metrics[0]?.benchmarkProduction}
                    stroke="#3b82f6"
                    strokeDasharray="5 5"
                    label={{ value: 'Benchmark Production', position: 'left' }}
                  />
                  <ReferenceLine
                    y={metrics[0]?.benchmarkWeight}
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    label={{ value: 'Benchmark Weight', position: 'left' }}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};