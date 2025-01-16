import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { roles } from "./staffConfig";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { StaffUpdateDialog } from "./StaffUpdateDialog";

interface StaffMember {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string;
  created_at: string;
  role: string;
}

interface StaffListProps {
  staffMembers: StaffMember[];
  refetchStaff: () => void;
  isLoading?: boolean;
}

export function StaffList({ staffMembers = [], refetchStaff, isLoading = false }: StaffListProps) {
  const { toast } = useToast();
  const session = useSession();
  const [staffToEdit, setStaffToEdit] = useState<StaffMember | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleDelete = async (staffId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: "Staff member removed",
        description: "The staff member has been successfully removed.",
      });
      refetchStaff();
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast({
        title: "Error",
        description: "Failed to remove staff member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (staff: StaffMember) => {
    setStaffToEdit(staff);
    setIsUpdateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white/5">
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!staffMembers || staffMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No staff members found
                </TableCell>
              </TableRow>
            ) : (
              staffMembers.map((staff) => (
                <TableRow key={staff.id} className="hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={staff.avatar_url || undefined} />
                        <AvatarFallback>
                          {staff.full_name?.substring(0, 2) || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{staff.full_name || "Unnamed Staff"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-opacity-15 hover:bg-opacity-25"
                    >
                      {roles[staff.role as keyof typeof roles]?.title || "Worker"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(staff.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(staff)}
                        className="hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-white/10"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gradient-to-br from-background via-background to-background/95 backdrop-blur-xl border border-white/20">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Staff Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this staff member? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(staff.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <StaffUpdateDialog
        staff={staffToEdit}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        onSuccess={() => {
          setIsUpdateDialogOpen(false);
          refetchStaff();
        }}
      />
    </>
  );
}