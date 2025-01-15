import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, PieChart, Wallet } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AddTransactionForm } from "@/components/finance/AddTransactionForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Loader2 } from "lucide-react";

const Finance = () => {
  const { formatCurrency } = useCurrency();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const calculateFinancials = () => {
    if (!transactions?.length) return {
      revenue: 0,
      expenses: 0,
      profit: 0,
      margin: 0
    };

    const totals = transactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount);
      if (transaction.type === 'income') {
        acc.revenue += amount;
      } else {
        acc.expenses += amount;
      }
      return acc;
    }, { revenue: 0, expenses: 0 });

    const profit = totals.revenue - totals.expenses;
    const margin = totals.revenue > 0 ? (profit / totals.revenue) * 100 : 0;

    return {
      revenue: totals.revenue,
      expenses: totals.expenses,
      profit,
      margin
    };
  };

  const financials = calculateFinancials();

  if (isLoading) {
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
            Financial Management
          </h1>
          <p className="text-muted-foreground">
            Track income, expenses, and financial analytics
          </p>
        </div>
        <AddTransactionForm />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financials.revenue)}</div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financials.expenses)}</div>
            <p className="text-xs text-muted-foreground">Total expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <PieChart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financials.profit)}</div>
            <p className="text-xs text-muted-foreground">Net profit</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financials.margin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Current margin</p>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-sm bg-white/50">
        <CardHeader>
          <CardTitle>Financial Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono">
                    {new Date(record.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono capitalize">{record.type}</TableCell>
                  <TableCell className="font-mono capitalize">{record.category}</TableCell>
                  <TableCell className="font-mono">{record.description}</TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(record.amount)}
                  </TableCell>
                </TableRow>
              ))}
              {!transactions?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No transactions found
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

export default Finance;