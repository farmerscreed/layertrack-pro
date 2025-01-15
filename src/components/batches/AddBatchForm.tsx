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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBatchManagement } from "@/hooks/useBatchManagement";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  breed: z.string().optional(),
  arrival_date: z.string(),
  cost_per_bird: z.coerce.number().min(0, "Cost per bird must be 0 or greater"),
  age_at_purchase: z.coerce.number().min(0, "Age must be 0 or greater"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddBatchForm() {
  const [open, setOpen] = useState(false);
  const { addBatch } = useBatchManagement();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      breed: "",
      arrival_date: new Date().toISOString().split('T')[0],
      cost_per_bird: 0,
      age_at_purchase: 0,
      notes: "",
    },
  });

  async function onSubmit(values: FormValues) {
    await addBatch.mutateAsync({
      name: values.name,
      quantity: values.quantity,
      breed: values.breed,
      arrival_date: values.arrival_date,
      cost_per_bird: values.cost_per_bird,
      age_at_purchase: values.age_at_purchase,
      notes: values.notes,
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="fixed md:static top-4 right-4 z-50 md:z-0 h-8 px-3 md:h-10 md:px-4 md:py-2"
        >
          Add Batch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Batch</DialogTitle>
          <DialogDescription>Add a new batch of birds to your farm.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter batch name" {...field} />
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
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter breed (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost_per_bird"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost per Bird</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="Enter cost per bird"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the purchase cost per bird
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age_at_purchase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age at Purchase (weeks)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="Enter age in weeks"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the age of birds when purchased (in weeks)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="arrival_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Date</FormLabel>
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes (optional)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={addBatch.isPending}
            >
              {addBatch.isPending ? "Adding..." : "Add Batch"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}