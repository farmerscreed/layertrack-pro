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

const formSchema = z.object({
  batchId: z.string().min(3, "Batch ID must be at least 3 characters"),
  breed: z.string().min(2, "Please select a breed"),
  count: z.string().transform((val) => parseInt(val, 10)),
  acquisitionDate: z.string(),
  source: z.string().min(2, "Source must be at least 2 characters"),
  initialCost: z.string().transform((val) => parseFloat(val)),
});

export function AddBatchForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchId: "",
      breed: "",
      count: "",
      acquisitionDate: new Date().toISOString().split("T")[0],
      source: "",
      initialCost: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send this data to your backend
    console.log(values);
    toast({
      title: "Batch Added Successfully",
      description: `Batch ${values.batchId} has been created.`,
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300">
          Add New Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-lg border border-white/20">
        <DialogHeader>
          <DialogTitle>Add New Batch</DialogTitle>
          <DialogDescription>
            Enter the details for the new batch of birds.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="batchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch ID</FormLabel>
                  <FormControl>
                    <Input placeholder="BAT001" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select breed" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="isa-brown">Isa Brown</SelectItem>
                      <SelectItem value="lohmann-brown">Lohmann Brown</SelectItem>
                      <SelectItem value="hy-line-brown">Hy-Line Brown</SelectItem>
                      <SelectItem value="novogen-brown">Novogen Brown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bird Count</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the total number of birds in this batch
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acquisitionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acquisition Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input placeholder="Supplier name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="initialCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Cost</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}