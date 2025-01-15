import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, PieChart, Wallet } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface FinancialMetrics {
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
}

export function FinancialMetricsCards({ metrics }: { metrics: FinancialMetrics }) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-gradient-to-br from-primary/10 to-transparent hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.revenue)}</div>
          <p className="text-xs text-muted-foreground">Total revenue</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-secondary/10 to-transparent hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <Wallet className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.expenses)}</div>
          <p className="text-xs text-muted-foreground">Total expenses</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-accent/10 to-transparent hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Profit</CardTitle>
          <PieChart className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.profit)}</div>
          <p className="text-xs text-muted-foreground">Net profit</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-destructive/10 to-transparent hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          <TrendingUp className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.margin.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Current margin</p>
        </CardContent>
      </Card>
    </div>
  );
}