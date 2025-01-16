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
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // First, sign up the user with email and a temporary password
      const tempPassword = Math.random().toString(36).slice(-12);
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: tempPassword,
        options: {
          data: {
            full_name: values.name,
            phone: values.phone,
            department: values.department,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Failed to create user');

      // Update the profile with additional information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.name,
          role: values.role,
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      toast({
        title: "Staff Member Added",
        description: `Added ${values.name} as ${roles[values.role].title}. They will receive an email to set their password.`,
      });
      
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error adding staff member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="fixed md:static top-4 right-4 z-50 md:z-0 h-8 px-3 md:h-10 md:px-4 md:py-2 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-background via-background to-background/95 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
          <DialogDescription>
            Create a new staff account with role-based permissions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StaffFormFields form={form} />
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
            >
              Add Staff Member
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}