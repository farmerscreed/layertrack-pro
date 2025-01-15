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
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { HealthRecordFormFields } from "./HealthRecordFormFields";
import { healthRecordFormSchema, type HealthRecordFormValues } from "@/types/health";

interface AddHealthRecordFormProps {
  batchId: string;
}

export function AddHealthRecordForm({ batchId }: AddHealthRecordFormProps) {
  const [open, setOpen] = useState(false);
  const { addHealthRecord } = useHealthRecords(batchId);

  const form = useForm<HealthRecordFormValues>({
    resolver: zodResolver(healthRecordFormSchema),
    defaultValues: {
      record_date: new Date().toISOString().split('T')[0],
      record_type: "",
      description: "",
      cost: null,
      notes: "",
    },
  });

  async function onSubmit(values: HealthRecordFormValues) {
    await addHealthRecord.mutateAsync({
      batch_id: batchId,
      record_date: values.record_date,
      record_type: values.record_type,
      description: values.description,
      cost: values.cost,
      notes: values.notes || "",
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Add Health Record</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Health Record</DialogTitle>
          <DialogDescription>Record a health-related event for this batch.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <HealthRecordFormFields form={form} />
            <Button 
              type="submit" 
              className="w-full"
              disabled={addHealthRecord.isPending}
            >
              {addHealthRecord.isPending ? "Adding..." : "Add Record"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}