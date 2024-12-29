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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function StaffList() {
  return (
    <div className="rounded-md border border-white/10">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-white/5">
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Start Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockStaffData.map((staff) => (
            <TableRow key={staff.id} className="hover:bg-white/5">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${staff.email}`} />
                    <AvatarFallback>{staff.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{staff.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    staff.role === "admin"
                      ? "destructive"
                      : staff.role === "manager"
                      ? "default"
                      : "secondary"
                  }
                  className="bg-opacity-15 hover:bg-opacity-25"
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