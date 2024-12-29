import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddStaffForm } from "@/components/staff/AddStaffForm";

const Staff = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage staff profiles and assignments
          </p>
        </div>
        <AddStaffForm />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Administrator</h3>
              <p className="text-sm text-muted-foreground">
                Full access to all system features including staff management, financial records, and system settings.
                Can manage user roles and permissions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Farm Manager</h3>
              <p className="text-sm text-muted-foreground">
                Can manage daily operations including production records, feed inventory, and health records.
                Has view-only access to financial data and analytics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Farm Worker</h3>
              <p className="text-sm text-muted-foreground">
                Can record daily activities such as egg collection, feed distribution, and basic health observations.
                Limited to data entry and viewing assigned tasks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Staff;