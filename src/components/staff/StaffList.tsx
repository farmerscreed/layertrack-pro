import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockStaffData, roles } from "./staffConfig";

export function StaffList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Start Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockStaffData.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">{staff.name}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    staff.role === "admin"
                      ? "destructive"
                      : staff.role === "manager"
                      ? "default"
                      : "secondary"
                  }
                >
                  {roles[staff.role].title}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{staff.department}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{staff.email}</div>
                  <div className="text-muted-foreground">{staff.phone}</div>
                </div>
              </TableCell>
              <TableCell>{staff.startDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}