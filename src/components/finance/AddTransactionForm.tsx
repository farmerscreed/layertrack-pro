import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionFormData } from "@/types/finance";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  date: z.string(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(2, "Category is required"),
  unitCost: z.coerce.number().min(0, "Unit cost must be non-negative"),
  quantity: z.coerce.number().min(0, "Quantity must be non-negative"),
  description: z.string().min(2, "Description is required"),
  paymentMethod: z.enum(["cash", "bank", "mobile"]),
});

const incomeCategories = ["egg_sales", "bird_sales", "manure_sales", "other_income"];
const expenseCategories = ["feed", "medicine", "equipment", "utilities", "labor", "maintenance", "other_expense"];

interface AddTransactionFormProps {
  editingTransaction?: Transaction | null;
  onEditComplete?: () => void;
}

export function AddTransactionForm({ editingTransaction, onEditComplete }: AddTransactionFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { currency } = useCurrency();
  const [selectedType, setSelectedType] = useState<"income" | "expense">("income");
  const [totalAmount, setTotalAmount] = useState(0);
  const queryClient = useQueryClient();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: "income",
      category: "",
      unitCost: 0,
      quantity: 0,
      description: "",
      paymentMethod: "cash",
    },
  });

  useEffect(() => {
    if (editingTransaction) {
      setOpen(true);
      form.reset({
        date: new Date(editingTransaction.created_at).toISOString().split("T")[0],
        type: editingTransaction.type as "income" | "expense",
        category: editingTransaction.category,
        unitCost: editingTransaction.unit_cost || 0,
        quantity: editingTransaction.quantity || 0,
        description: editingTransaction.description || "",
        paymentMethod: editingTransaction.payment_method as "cash" | "bank" | "mobile" || "cash",
      });
      setSelectedType(editingTransaction.type as "income" | "expense");
    }
  }, [editingTransaction, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'unitCost' || name === 'quantity') {
        const unitCost = form.getValues('unitCost');
        const quantity = form.getValues('quantity');
        setTotalAmount(unitCost * quantity);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  async function onSubmit(values: TransactionFormData) {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const transactionData = {
        user_id: userId,
        type: values.type,
        category: values.category,
        amount: totalAmount,
        quantity: values.quantity,
        unit_cost: values.unitCost,
        description: values.description,
        payment_method: values.paymentMethod,
        created_at: new Date(values.date).toISOString(),
      };

      let error;
      if (editingTransaction) {
        const { error: updateError } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', editingTransaction.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('transactions')
          .insert(transactionData);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: editingTransaction ? "Transaction Updated" : "Transaction Added",
        description: `${editingTransaction ? 'Updated' : 'Added'} ${values.type} transaction of ${currency} ${totalAmount}.`,
      });
      
      setOpen(false);
      form.reset();
      if (onEditComplete) onEditComplete();
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingTransaction ? 'update' : 'add'} transaction. Please try again.`,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="fixed md:static top-4 right-4 z-50 md:z-0 h-8 px-3 md:h-10 md:px-4 md:py-2"
        >
          {editingTransaction ? 'Edit' : 'Add'} Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingTransaction ? 'Edit' : 'Add'} Transaction</DialogTitle>
          <DialogDescription>
            {editingTransaction ? 'Modify' : 'Record'} a financial transaction.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedType(value as "income" | "expense");
                      form.setValue("category", "");
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(selectedType === "income" ? incomeCategories : expenseCategories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Cost ({currency})</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="py-2">
              <p className="text-sm font-medium">Total Amount: {currency} {totalAmount}</p>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="mobile">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{editingTransaction ? 'Update' : 'Submit'}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}