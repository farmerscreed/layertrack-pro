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
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check authentication and session status
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw new Error("Authentication required");
        }

        // Check if user has admin role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!profile || profile.role !== 'admin') {
          throw new Error("Unauthorized access");
        }

        if (mounted) {
          setIsAuthorized(true);
        }
      } catch (error: any) {
        console.error('Auth error:', error);
        toast({
          title: "Access Denied",
          description: error.message || "Please sign in with an admin account",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (mounted) {
          setIsAuthorized(false);
          navigate("/login");
        }
      } else {
        checkAuth();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Fetch staff members with error handling
  const { data: staffMembers, isLoading, error, refetch } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("Authentication required");
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        return data || [];
      } catch (error: any) {
        console.error("Error fetching staff:", error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: isAuthorized, // Only fetch when user is authorized
  });

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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