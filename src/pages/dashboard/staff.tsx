import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddStaffForm } from "@/components/staff/AddStaffForm";
import { StaffList } from "@/components/staff/StaffList";
import { Users, ShieldCheck, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

const Staff = () => {
  const session = useSession();

  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const newThisMonth = staffMembers?.filter(member => {
    const createdAt = new Date(member.created_at);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && 
           createdAt.getFullYear() === now.getFullYear();
  }).length || 0;

  if (isLoading) {
    return <div>Loading staff data...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Staff Management
          </h1>
          <p className="text-muted-foreground">
            Manage staff profiles and role-based permissions
          </p>
        </div>
        <AddStaffForm />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffMembers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <UserPlus className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Recent additions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <ShieldCheck className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Permission levels</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-white/20 backdrop-blur-sm bg-white/5">
        <CardHeader>
          <CardTitle>Current Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffList staffMembers={staffMembers} />
        </CardContent>
      </Card>

      <Card className="border border-white/20 backdrop-blur-sm bg-white/5">
        <CardHeader>
          <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-colors">
              <h3 className="font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Administrator
              </h3>
              <p className="text-sm text-muted-foreground">
                Full access to all system features including staff management,
                financial records, and system settings.
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-secondary/5 to-transparent hover:from-secondary/10 transition-colors">
              <h3 className="font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                Farm Manager
              </h3>
              <p className="text-sm text-muted-foreground">
                Can manage daily operations including production records, feed
                inventory, and health records.
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-accent/5 to-transparent hover:from-accent/10 transition-colors">
              <h3 className="font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent" />
                Farm Worker
              </h3>
              <p className="text-sm text-muted-foreground">
                Can record daily activities such as egg collection, feed
                distribution, and basic health observations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Staff;