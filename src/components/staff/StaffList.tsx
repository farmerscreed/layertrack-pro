import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import StaffUpdateDialog from "./StaffUpdateDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface StaffListProps {
  staff: Array<{
    id: string;
    full_name: string;
    role: string;
    email_notifications?: boolean;
    push_notifications?: boolean;
    mobile_alerts?: boolean;
    currency_preference?: string;
  }>;
  onUpdate: () => void;
}

export default function StaffList({ staff, onUpdate }: StaffListProps) {
  const { toast } = useToast();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);

      // First delete the profile (this will cascade to related records)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (profileError) throw profileError;

      // Call the edge function using Supabase's functions.invoke
      const { error: deleteError } = await supabase.functions.invoke('delete-user', {
        body: { userId: id }
      });

      if (deleteError) throw deleteError;
      
      onUpdate();
      toast({
        title: "Success",
        description: "Staff member removed successfully",
      });
    } catch (error: any) {
      console.error("Error deleting staff member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove staff member",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!staff || staff.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No staff members found.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.full_name}</TableCell>
              <TableCell className="capitalize">{member.role}</TableCell>
              <TableCell className="text-right space-x-2">
                <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMember(member)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  {selectedMember && (
                    <DialogContent>
                      <StaffUpdateDialog
                        staffMember={selectedMember}
                        onSuccess={() => {
                          setIsUpdateDialogOpen(false);
                          onUpdate();
                        }}
                      />
                    </DialogContent>
                  )}
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Removing..." : "Remove"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        staff member's account and remove their access to the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(member.id)}
                        disabled={isDeleting}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}