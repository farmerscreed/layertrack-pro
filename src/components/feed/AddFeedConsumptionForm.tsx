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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBatchManagement } from "@/hooks/useBatchManagement";

const formSchema = z.object({
  quantity: z.coerce.number().min(0.1, "Quantity must be greater than 0"),
  batch_id: z.string().min(1, "Please select a batch"),
  feed_inventory_id: z.string().min(1, "Please select a feed type"),
  notes: z.string().optional(),
  date: z.string(),
});

interface FeedOption {
  id: string;
  feed_type: string;
  quantity_kg: number;
}

export function AddFeedConsumptionForm({ feedInventory }: { feedInventory: FeedOption[] }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { batches } = useBatchManagement();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
      batch_id: "",
      feed_inventory_id: "",
      notes: "",
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

      // Record feed consumption
      const { error: consumptionError } = await supabase
        .from('feed_consumption')
        .insert({
          user_id: userId,
          feed_inventory_id: values.feed_inventory_id,
          batch_id: values.batch_id,
          quantity_kg: values.quantity,
          consumption_date: values.date,
          notes: values.notes,
        });

      if (consumptionError) throw consumptionError;

      toast({
        title: "Consumption Recorded",
        description: `Recorded ${values.quantity}kg of feed consumption.`,
      });
      
      setOpen(false);
      form.reset();
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['feed_inventory'] });
      queryClient.invalidateQueries({ queryKey: ['feed_consumption'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record feed consumption. Please try again.",
        variant: "destructive",
      });
    }
  }

  const activeBatches = batches?.filter(batch => batch.status === 'active') || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-3">
          Record Consumption
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Feed Consumption</DialogTitle>
          <DialogDescription>Enter feed consumption details for a batch.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="batch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeBatches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.name} ({batch.quantity} birds)
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
              name="feed_inventory_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feed Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feed type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {feedInventory.map((feed) => (
                        <SelectItem key={feed.id} value={feed.id}>
                          {feed.feed_type} ({feed.quantity_kg}kg available)
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
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
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
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
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