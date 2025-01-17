import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AddStaffForm } from "@/components/staff/AddStaffForm";
import StaffList from "@/components/staff/StaffList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Staff = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.error("Session error:", error);
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkSession();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  // Fetch staff members
  const { data: staffMembers, isLoading, error, refetch } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching staff:", error);
        throw error;
      }

      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading staff members. Please try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
          <DialogTrigger asChild>
            <Button>Add Staff Member</Button>
          </DialogTrigger>
          <DialogContent>
            <AddStaffForm
              onSuccess={() => {
                setIsAddStaffOpen(false);
                refetch();
                toast({
                  title: "Success",
                  description: "Staff member added successfully",
                });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <StaffList 
        staff={staffMembers || []} 
        onUpdate={() => {
          refetch();
          toast({
            title: "Success",
            description: "Staff list updated successfully",
          });
        }} 
      />
    </div>
  );
};

export default Staff;