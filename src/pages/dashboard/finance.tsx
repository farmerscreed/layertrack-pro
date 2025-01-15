import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { AddTransactionForm } from "@/components/finance/AddTransactionForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FinancialMetricsCards } from "@/components/finance/FinancialMetricsCards";
import { TransactionsTable } from "@/components/finance/TransactionsTable";
import { Transaction } from "@/types/finance";
import { useState } from "react";

const Finance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Transaction Deleted",
        description: "The transaction has been successfully deleted.",
      });

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

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
        <AddTransactionForm 
          editingTransaction={editingTransaction} 
          onEditComplete={() => setEditingTransaction(null)} 
        />
      </div>

      <FinancialMetricsCards metrics={financials} />

      <Card className="backdrop-blur-sm bg-white/50">
        <CardHeader>
          <CardTitle>Financial Records</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsTable
            transactions={transactions || []}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Finance;