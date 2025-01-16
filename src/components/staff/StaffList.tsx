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

interface StaffMember {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string;
  created_at: string;
}

interface StaffListProps {
  staffMembers: StaffMember[];
}

export function StaffList({ staffMembers }: StaffListProps) {
  return (
    <div className="rounded-md border border-white/10">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-white/5">
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Start Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffMembers.map((staff) => (
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
                  {roles.worker.title}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(staff.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}