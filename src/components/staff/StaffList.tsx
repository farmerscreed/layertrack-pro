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
import { Trash2 } from "lucide-react";
import { roles } from "./staffConfig";
import { StaffUpdateDialog } from "./StaffUpdateDialog";

export function StaffList({ staffMembers, refetchStaff }: { staffMembers: any[]; refetchStaff: () => void }) {
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

      toast({
        title: "Staff member deleted",
        description: "The staff member has been removed successfully.",
      });
      
      refetchStaff();
    } catch (error: any) {
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

  if (!staffMembers) {
    return <div>No staff members found.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.full_name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{roles[member.role]?.title || member.role}</TableCell>
              <TableCell className="text-right space-x-2">
                <StaffUpdateDialog staff={member} onUpdate={refetchStaff} />
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