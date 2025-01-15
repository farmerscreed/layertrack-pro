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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useHealthRecords } from "@/hooks/useHealthRecords";

const formSchema = z.object({
  vaccine_name: z.string().min(1, "Vaccine name is required"),
  scheduled_date: z.string(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddVaccinationFormProps {
  batchId: string;
}

export function AddVaccinationForm({ batchId }: AddVaccinationFormProps) {
  const [open, setOpen] = useState(false);
  const { addVaccinationSchedule } = useHealthRecords(batchId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vaccine_name: "",
      scheduled_date: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  async function onSubmit(values: FormValues) {
    await addVaccinationSchedule.mutateAsync({
      batch_id: batchId,
      status: 'pending',
      vaccine_name: values.vaccine_name,
      scheduled_date: values.scheduled_date,
      notes: values.notes,
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Schedule Vaccination</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Vaccination</DialogTitle>
          <DialogDescription>Schedule a vaccination for this batch.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vaccine_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccine Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vaccine name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduled_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Date</FormLabel>
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
                    <Textarea 
                      placeholder="Add any additional notes"
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
              disabled={addVaccinationSchedule.isPending}
            >
              {addVaccinationSchedule.isPending ? "Scheduling..." : "Schedule Vaccination"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}