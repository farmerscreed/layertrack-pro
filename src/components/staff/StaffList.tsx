import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, UserCog } from "lucide-react";
import { roles } from "./staffConfig";
import { StaffUpdateDialog } from "./StaffUpdateDialog";

export function StaffList({ staff, onUpdate }: { staff: any[]; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (userId: string) => {
    try {
      setLoading(true);
      
      // First, delete all related transactions
      const { error: transactionError } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', userId);

      if (transactionError) throw transactionError;

      // Then delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Finally delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) throw authError;

      toast({
        title: "Staff member deleted",
        description: "The staff member has been removed successfully.",
      });
      
      onUpdate();
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete staff member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.full_name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{roles[member.role]?.title || member.role}</TableCell>
              <TableCell>{member.department}</TableCell>
              <TableCell className="text-right space-x-2">
                <StaffUpdateDialog member={member} onUpdate={onUpdate} />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(member.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}