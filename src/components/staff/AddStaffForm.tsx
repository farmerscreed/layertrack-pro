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
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { roles } from "./staffConfig";
import { StaffFormFields } from "./StaffFormFields";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  role: z.enum(["admin", "manager", "worker"]),
  department: z.string().min(2, "Department is required"),
  startDate: z.string(),
});

export function AddStaffForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "worker",
      department: "",
      startDate: new Date().toISOString().split("T")[0],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const roleDetails = roles[values.role];
    toast({
      title: "Staff Member Added",
      description: `Added ${values.name} as ${roleDetails.title} with ${roleDetails.permissions.length} permissions.`,
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
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
          <DialogDescription>
            Create a new staff account with role-based permissions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StaffFormFields form={form} />
            <Button type="submit">Add Staff Member</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}