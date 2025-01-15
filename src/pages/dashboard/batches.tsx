import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bird, MoreVertical, Loader2 } from "lucide-react";
import { AddBatchForm } from "@/components/batches/AddBatchForm";
import { useBatchManagement } from "@/hooks/useBatchManagement";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const Batches = () => {
  const { batches, isLoadingBatches, deleteBatch } = useBatchManagement();

  const totalBirds = batches?.reduce((acc, batch) => acc + batch.quantity, 0) || 0;
  const activeBatches = batches?.filter(batch => batch.status === 'active').length || 0;
  
  const averageAge = batches?.length 
    ? Math.round(batches.reduce((acc, batch) => {
        const weeks = Math.round((new Date().getTime() - new Date(batch.arrival_date).getTime()) / (1000 * 60 * 60 * 24 * 7));
        return acc + weeks;
      }, 0) / batches.length)
    : 0;

  const mortalityRate = batches?.length
    ? (batches.reduce((acc, batch) => {
        return acc + (batch.batch_performance?.[0]?.mortality_rate || 0);
      }, 0) / batches.length).toFixed(1)
    : 0;

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
            <div className="text-2xl font-bold">{totalBirds}</div>
            <p className="text-xs text-muted-foreground">Across all batches</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Age</CardTitle>
            <Bird className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAge} weeks</div>
            <p className="text-xs text-muted-foreground">Weighted average</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mortality Rate</CardTitle>
            <Bird className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mortalityRate}%</div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Bird className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBatches}</div>
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
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Bird Count</TableHead>
                  <TableHead>Age (weeks)</TableHead>
                  <TableHead>Mortality (%)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingBatches ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : batches?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No batches found. Add your first batch to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  batches?.map((batch) => {
                    const weeks = Math.round(
                      (new Date().getTime() - new Date(batch.arrival_date).getTime()) /
                        (1000 * 60 * 60 * 24 * 7)
                    );
                    return (
                      <TableRow key={batch.id} className="hover:bg-white/5">
                        <TableCell className="font-medium">{batch.name}</TableCell>
                        <TableCell>{batch.breed || "N/A"}</TableCell>
                        <TableCell>{batch.quantity}</TableCell>
                        <TableCell>{weeks}</TableCell>
                        <TableCell>
                          {batch.batch_performance?.[0]?.mortality_rate?.toFixed(1) || "0.0"}%
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            batch.status === 'active' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-gray-500/10 text-gray-500'
                          }`}>
                            {batch.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this batch?')) {
                                    deleteBatch.mutate(batch.id);
                                  }
                                }}
                              >
                                Delete Batch
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Batches;