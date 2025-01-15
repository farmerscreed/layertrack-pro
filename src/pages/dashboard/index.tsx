import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImportDataDialog } from "@/components/import/ImportDataDialog"
import { Bird, DollarSign, Egg, ShoppingCart } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useCurrency } from "@/contexts/CurrencyContext"
import { Loader2 } from "lucide-react"

const Dashboard = () => {
  const { formatCurrency } = useCurrency();

  const { data: batches, isLoading: isLoadingBatches } = useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .eq('status', 'active');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: eggProduction, isLoading: isLoadingEggs } = useQuery({
    queryKey: ['egg_production_today'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('egg_production')
        .select('quantity')
        .eq('collection_date', today);
      if (error) throw error;
      return data || [];
    }
  });

  const { data: feedInventory, isLoading: isLoadingFeed } = useQuery({
    queryKey: ['feed_inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feed_inventory')
        .select('quantity_kg');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions_month'],
    queryFn: async () => {
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', firstDayOfMonth)
        .eq('type', 'income');
      if (error) throw error;
      return data || [];
    }
  });

  const totalBirds = batches?.reduce((acc, batch) => acc + batch.quantity, 0) || 0;
  const todayEggs = eggProduction?.reduce((acc, record) => acc + record.quantity, 0) || 0;
  const totalFeed = feedInventory?.reduce((acc, record) => acc + record.quantity_kg, 0) || 0;
  const monthlyRevenue = transactions?.reduce((acc, transaction) => acc + transaction.amount, 0) || 0;

  if (isLoadingBatches || isLoadingEggs || isLoadingFeed || isLoadingTransactions) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome to your farm management dashboard
          </p>
        </div>
        <ImportDataDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Birds</CardTitle>
            <Bird className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBirds}</div>
            <p className="text-xs text-muted-foreground">Across all batches</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Production</CardTitle>
            <Egg className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEggs}</div>
            <p className="text-xs text-muted-foreground">Eggs collected today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Feed Stock</CardTitle>
            <ShoppingCart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeed} kg</div>
            <p className="text-xs text-muted-foreground">Current inventory</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard