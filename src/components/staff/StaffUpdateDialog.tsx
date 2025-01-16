import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StaffFormFields } from "./StaffFormFields";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  role: z.enum(["admin", "manager", "worker"]),
  department: z.string().min(2, "Department is required"),
  startDate: z.string(),
});

interface StaffUpdateDialogProps {
  staff: {
    id: string;
    full_name: string | null;
    role?: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function StaffUpdateDialog({ staff, open, onOpenChange, onSuccess }: StaffUpdateDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staff?.full_name || "",
      role: (staff?.role as "admin" | "manager" | "worker") || "worker",
      email: "",
      phone: "",
      department: "",
      startDate: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!staff?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.name,
          role: values.role,
        })
        .eq('id', staff.id);

      if (error) throw error;

      toast({
        title: "Staff Member Updated",
        description: `Successfully updated ${values.name}'s information.`,
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating staff member:', error);
      toast({
        title: "Error",
        description: "Failed to update staff member. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-background via-background to-background/95 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle>Update Staff Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StaffFormFields form={form} />
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
            >
              Update Staff Member
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}