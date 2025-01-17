import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StaffUpdateDialogProps {
  staffMember: {
    id: string;
    full_name: string;
    role: string;
  };
  onSuccess: () => void;
}

export default function StaffUpdateDialog({ staffMember, onSuccess }: StaffUpdateDialogProps) {
  const { toast } = useToast();
  const [fullName, setFullName] = useState(staffMember.full_name);
  const [role, setRole] = useState(staffMember.role);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          role: role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", staffMember.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
      onSuccess();
    } catch (error: any) {
      console.error("Error updating staff member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update staff member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="manager">Farm Manager</SelectItem>
            <SelectItem value="worker">Farm Worker</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Staff Member"}
      </Button>
    </form>
  );
}