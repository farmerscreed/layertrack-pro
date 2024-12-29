import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bird, MoreVertical } from "lucide-react";
import { AddBatchForm } from "@/components/batches/AddBatchForm";

const batches = [
  {
    id: "BAT001",
    breed: "Isa Brown",
    count: 5000,
    age: 45,
    mortality: 0.5,
    status: "Active",
  },
  {
    id: "BAT002",
    breed: "Lohmann Brown",
    count: 3500,
    age: 30,
    mortality: 0.3,
    status: "Active",
  },
  {
    id: "BAT003",
    breed: "Hy-Line Brown",
    count: 4200,
    age: 20,
    mortality: 0.2,
    status: "Active",
  },
];

const Batches = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Batch Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor your bird batches
          </p>
        </div>
        <AddBatchForm />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Birds</CardTitle>
            <Bird className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,700</div>
            <p className="text-xs text-muted-foreground">Across all batches</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Age</CardTitle>
            <Bird className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 weeks</div>
            <p className="text-xs text-muted-foreground">Weighted average</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mortality Rate</CardTitle>
            <Bird className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.33%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Bird className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Active Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border border-white/10">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-white/5">
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Bird Count</TableHead>
                  <TableHead>Age (weeks)</TableHead>
                  <TableHead>Mortality (%)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id} className="hover:bg-white/5 transition-colors">
                    <TableCell className="font-mono">{batch.id}</TableCell>
                    <TableCell>{batch.breed}</TableCell>
                    <TableCell className="font-mono">{batch.count.toLocaleString()}</TableCell>
                    <TableCell className="font-mono">{batch.age}</TableCell>
                    <TableCell className="font-mono">{batch.mortality}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                        {batch.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="inline-flex items-center justify-center rounded-md w-8 h-8 hover:bg-white/10 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Batches;