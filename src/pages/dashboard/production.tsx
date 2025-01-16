import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Egg, TrendingUp } from "lucide-react";
import { AddEggCollectionForm } from "@/components/production/AddEggCollectionForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";

const Production = () => {
  const session = useSession();
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  const { data: productionData, isLoading } = useQuery({
    queryKey: ['egg-production'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('egg_production')
        .select(`
          *,
          batch:batches(name, quantity)
        `)
        .order('collection_date', { ascending: false })
        .limit(7);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    const channel = supabase
      .channel('egg-production-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'egg_production' },
        (payload) => {
          setRealtimeData((current) => {
            const updated = [...current];
            if (payload.eventType === 'INSERT') {
              updated.unshift(payload.new);
            }
            return updated.slice(0, 7);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const data = realtimeData.length > 0 ? realtimeData : productionData || [];
  const todayProduction = data[0] || { quantity: 0, damaged: 0 };
  const yesterdayProduction = data[1] || { quantity: 0 };
  
  const percentChange = yesterdayProduction.quantity 
    ? ((todayProduction.quantity - yesterdayProduction.quantity) / yesterdayProduction.quantity * 100).toFixed(1)
    : 0;

  const gradeA = Math.floor(todayProduction.quantity * 0.85);
  
  // Calculate laying rate using the actual batch quantity
  const calculateLayingRate = (record: any) => {
    if (!record?.batch?.quantity || record.batch.quantity === 0) return 0;
    return ((record.quantity / record.batch.quantity) * 100).toFixed(1);
  };

  const layingRate = calculateLayingRate(todayProduction);

  if (isLoading) {
    return <div>Loading production data...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">Production Tracking</h1>
          <p className="text-muted-foreground">
            Monitor and record daily egg production
          </p>
        </div>
        <div className="flex justify-end">
          <AddEggCollectionForm />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Production</CardTitle>
            <Egg className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayProduction.quantity}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className={`h-3 w-3 ${Number(percentChange) >= 0 ? 'text-green-500' : 'text-red-500'} mr-1`} />
              <span className={Number(percentChange) >= 0 ? 'text-green-500' : 'text-red-500'}>
                {percentChange}%
              </span> vs yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Grade A</CardTitle>
            <Egg className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gradeA}</div>
            <p className="text-xs text-muted-foreground">85% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Laying Rate</CardTitle>
            <Egg className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{layingRate}%</div>
            <p className="text-xs text-muted-foreground">Current rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <Egg className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayProduction.damaged || 0}</div>
            <p className="text-xs text-muted-foreground">
              {((todayProduction.damaged || 0) / todayProduction.quantity * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-sm bg-white/50">
        <CardHeader>
          <CardTitle>Production Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="collection_date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="quantity" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={false}
                  name="Total Eggs"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-white/50">
        <CardHeader>
          <CardTitle>Recent Production Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Total Production</TableHead>
                <TableHead>Damaged</TableHead>
                <TableHead>Laying Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono">
                    {new Date(record.collection_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{record.batch?.name}</TableCell>
                  <TableCell className="font-mono">{record.quantity.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{record.damaged || 0}</TableCell>
                  <TableCell className="font-mono">
                    {calculateLayingRate(record)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Production;
