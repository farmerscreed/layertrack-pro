import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Package, TrendingDown, AlertTriangle } from "lucide-react";
import { AddFeedForm } from "@/components/feed/AddFeedForm";
import { AddFeedConsumptionForm } from "@/components/feed/AddFeedConsumptionForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FeedInventory } from "@/types/feed";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Feed = () => {
  const { formatCurrency } = useCurrency();

  const { data: feedInventory, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['feed_inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feed_inventory')
        .select('*')
        .order('purchase_date', { ascending: false });
      
      if (error) throw error;
      return data as FeedInventory[];
    }
  });

  const { data: feedConsumption, isLoading: isLoadingConsumption } = useQuery({
    queryKey: ['feed_consumption'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feed_consumption')
        .select(`
          *,
          batches (
            name
          )
        `)
        .order('consumption_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const calculateMetrics = () => {
    if (!feedInventory?.length) return {
      currentStock: 0,
      dailyConsumption: 0,
      lastPurchaseCost: 0,
      stockStatus: "No data"
    };

    const totalStock = feedInventory.reduce((sum, record) => sum + record.quantity_kg, 0);
    const lastRecord = feedInventory[0];
    
    // Calculate average daily consumption from the last 7 days
    const last7DaysConsumption = feedConsumption
      ?.filter(record => {
        const date = new Date(record.consumption_date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return date >= sevenDaysAgo;
      })
      .reduce((sum, record) => sum + Number(record.quantity_kg), 0) || 0;

    const averageConsumption = last7DaysConsumption / 7;

    // Calculate days of feed remaining
    const daysRemaining = averageConsumption > 0 ? Math.floor(totalStock / averageConsumption) : 0;

    return {
      currentStock: totalStock,
      dailyConsumption: averageConsumption,
      lastPurchaseCost: lastRecord?.cost_per_kg || 0,
      stockStatus: daysRemaining < 7 ? "Low" : "Adequate",
      daysRemaining
    };
  };

  const metrics = calculateMetrics();

  if (isLoadingInventory || isLoadingConsumption) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Feed Management
          </h1>
          <p className="text-muted-foreground">
            Track feed inventory and consumption
          </p>
        </div>
        <div className="space-x-2">
          <AddFeedConsumptionForm feedInventory={feedInventory || []} />
          <AddFeedForm />
        </div>
      </div>

      {metrics.stockStatus === "Low" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Low Feed Stock Alert</AlertTitle>
          <AlertDescription>
            Current feed stock will last approximately {metrics.daysRemaining} days based on recent consumption patterns. Consider restocking soon.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.currentStock.toFixed(1)}kg</div>
            <p className="text-xs text-muted-foreground">Total feed available</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Consumption</CardTitle>
            <TrendingDown className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.dailyConsumption.toFixed(1)}kg</div>
            <p className="text-xs text-muted-foreground">Average consumption</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Feed Cost</CardTitle>
            <ShoppingCart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.lastPurchaseCost)}/kg</div>
            <p className="text-xs text-muted-foreground">Last purchase</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.stockStatus}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.daysRemaining} days remaining
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-sm bg-white/50">
        <CardHeader>
          <CardTitle>Feed Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Feed Type</TableHead>
                <TableHead>Quantity (kg)</TableHead>
                <TableHead>Cost per kg</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedInventory?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono">
                    {new Date(record.purchase_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono">{record.feed_type}</TableCell>
                  <TableCell className="font-mono">{record.quantity_kg}</TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(record.cost_per_kg || 0)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency((record.cost_per_kg || 0) * record.quantity_kg)}
                  </TableCell>
                  <TableCell className="font-mono">{record.supplier}</TableCell>
                </TableRow>
              ))}
              {!feedInventory?.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No feed records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-white/50">
        <CardHeader>
          <CardTitle>Consumption History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Quantity (kg)</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedConsumption?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono">
                    {new Date(record.consumption_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono">{record.batches?.name}</TableCell>
                  <TableCell className="font-mono">{record.quantity_kg}</TableCell>
                  <TableCell className="font-mono">{record.notes || '-'}</TableCell>
                </TableRow>
              ))}
              {!feedConsumption?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No consumption records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Feed;