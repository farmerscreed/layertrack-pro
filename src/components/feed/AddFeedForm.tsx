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
  numberOfBags: z.coerce.number().min(1, "Number of bags must be at least 1"),
  bagSize: z.coerce.number().min(1, "Bag size must be at least 1"),
  type: z.string().min(2, "Feed type must be at least 2 characters"),
  supplier: z.string().min(2, "Supplier must be at least 2 characters"),
  costPerBag: z.coerce.number().min(0, "Cost must be non-negative"),
  date: z.string(),
});

export function AddFeedForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfBags: 0,
      bagSize: 50, // Default bag size of 50kg
      type: "",
      supplier: "",
      costPerBag: 0,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const calculateTotalQuantity = (numberOfBags: number, bagSize: number) => {
    return numberOfBags * bagSize;
  };

  const calculateCostPerKg = (costPerBag: number, bagSize: number) => {
    return costPerBag / bagSize;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const totalQuantityKg = calculateTotalQuantity(values.numberOfBags, values.bagSize);
      const costPerKg = calculateCostPerKg(values.costPerBag, values.bagSize);

      // Create feed inventory record
      const { data: feedData, error: feedError } = await supabase
        .from('feed_inventory')
        .insert({
          user_id: userId,
          feed_type: values.type,
          quantity_kg: totalQuantityKg,
          purchase_date: values.date,
          cost_per_kg: costPerKg,
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
          amount: values.numberOfBags * values.costPerBag,
          quantity: totalQuantityKg,
          unit_cost: costPerKg,
          description: `Purchased ${values.numberOfBags} bags (${values.bagSize}kg each) of ${values.type} feed from ${values.supplier}`,
          payment_method: 'cash',
          created_at: new Date(values.date).toISOString(),
          feed_inventory_id: feedData.id,
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Feed Record Added",
        description: `Added ${values.numberOfBags} bags (${totalQuantityKg}kg total) of ${values.type} feed.`,
      });
      
      setOpen(false);
      form.reset();
      
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
              name="numberOfBags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Bags</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bagSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bag Size (kg)</FormLabel>
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
              name="costPerBag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost per Bag</FormLabel>
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