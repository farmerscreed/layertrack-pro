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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";

const formSchema = z.object({
  date: z.string(),
  totalEggs: z.coerce.number().min(0, "Total eggs must be non-negative"),
  gradeA: z.coerce.number().min(0, "Grade A eggs must be non-negative"),
  gradeB: z.coerce.number().min(0, "Grade B eggs must be non-negative"),
  damaged: z.coerce.number().min(0, "Damaged eggs must be non-negative"),
  collectedBy: z.string().min(2, "Collector name required"),
  batchId: z.string().min(3, "Batch ID required"),
});

// Fetch batches from Supabase
const fetchBatches = async (userId: string) => {
  const { data, error } = await supabase
    .from('batches')
    .select('id, name')
    .eq('user_id', userId)
    .eq('status', 'active');
  
  if (error) throw error;
  return data;
};

// Fetch staff members from profiles table
const fetchStaff = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name');
  
  if (error) throw error;
  return data;
};

export function AddEggCollectionForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: batches, isLoading: batchesLoading } = useQuery({
    queryKey: ['batches', session?.user?.id],
    queryFn: () => fetchBatches(session?.user?.id || ''),
    enabled: !!session?.user?.id,
  });

  const { data: staff, isLoading: staffLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => fetchStaff(session?.user?.id || ''),
    enabled: !!session?.user?.id,
  });

  const addEggCollection = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase
        .from('egg_production')
        .insert({
          batch_id: values.batchId,
          collection_date: values.date,
          quantity: values.totalEggs,
          damaged: values.damaged,
          notes: `Grade A: ${values.gradeA}, Grade B: ${values.gradeB}, Collected by: ${values.collectedBy}`,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['egg-production'] });
      toast({
        title: "Collection Record Added",
        description: "The egg collection record has been saved successfully.",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save egg collection record. Please try again.",
        variant: "destructive",
      });
      console.error('Error adding egg collection:', error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      totalEggs: 0,
      gradeA: 0,
      gradeB: 0,
      damaged: 0,
      collectedBy: "",
      batchId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addEggCollection.mutate(values);
  }

  if (batchesLoading || staffLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="fixed md:static top-4 right-4 z-50 md:z-0 h-8 px-3 md:h-10 md:px-4 md:py-2"
        >
          Add Collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Egg Collection Record</DialogTitle>
          <DialogDescription>Enter collection details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="batchId"
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
                      {batches?.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.name}
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
              name="totalEggs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Eggs</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gradeA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade A</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gradeB"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade B</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="damaged"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Damaged</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collectedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collected By</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {staff?.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={addEggCollection.isPending}>
              {addEggCollection.isPending ? "Saving..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}