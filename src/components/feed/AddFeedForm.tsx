import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  type: z.string().min(2, "Feed type must be at least 2 characters"),
  supplier: z.string().min(2, "Supplier must be at least 2 characters"),
  cost: z.coerce.number().min(0, "Cost must be non-negative"),
  date: z.string(),
});

export function AddFeedForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
      type: "",
      supplier: "",
      cost: 0,
      date: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Create feed inventory record
      const { data: feedData, error: feedError } = await supabase
        .from('feed_inventory')
        .insert({
          user_id: userId,
          feed_type: values.type,
          quantity_kg: values.quantity,
          purchase_date: values.date,
          cost_per_kg: values.cost,
          supplier: values.supplier,
        })
        .select()
        .single();

      if (feedError) throw feedError;

      // Create corresponding transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'expense',
          category: 'feed',
          amount: values.quantity * values.cost,
          quantity: values.quantity,
          unit_cost: values.cost,
          description: `Purchased ${values.quantity}kg of ${values.type} feed from ${values.supplier}`,
          payment_method: 'cash',
          created_at: new Date(values.date).toISOString(),
          feed_inventory_id: feedData.id,
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Feed Record Added",
        description: `Added ${values.quantity}kg of ${values.type} feed.`,
      });
      
      setOpen(false);
      form.reset();
      
      // Invalidate both feed and transaction queries
      queryClient.invalidateQueries({ queryKey: ['feed_inventory'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add feed record. Please try again.",
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
          Add Feed
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Feed Record</DialogTitle>
          <DialogDescription>Enter feed purchase details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
                  <FormLabel>Feed Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Layer feed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Input placeholder="Supplier name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost per kg</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}