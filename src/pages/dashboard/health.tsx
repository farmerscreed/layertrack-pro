import { useParams } from "react-router-dom";
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { AddHealthRecordForm } from "@/components/health/AddHealthRecordForm";
import { AddVaccinationForm } from "@/components/health/AddVaccinationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function Health() {
  const { batchId } = useParams<{ batchId: string }>();
  const { 
    healthRecords, 
    vaccinationSchedules,
    updateVaccinationStatus 
  } = useHealthRecords(batchId!);

  if (healthRecords.isLoading || vaccinationSchedules.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Health Records</h2>
        <div className="space-x-4">
          <AddHealthRecordForm batchId={batchId!} />
          <AddVaccinationForm batchId={batchId!} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Health Records */}
        <Card>
          <CardHeader>
            <CardTitle>Health Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healthRecords.data?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {format(new Date(record.record_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="capitalize">{record.record_type}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>
                      {record.cost ? `$${record.cost.toFixed(2)}` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Vaccination Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Vaccination Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vaccine</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vaccinationSchedules.data?.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      {format(new Date(schedule.scheduled_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{schedule.vaccine_name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          schedule.status === 'completed' ? 'default' :
                          schedule.status === 'pending' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {schedule.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {schedule.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            updateVaccinationStatus.mutate({
                              id: schedule.id,
                              status: 'completed'
                            });
                          }}
                          disabled={updateVaccinationStatus.isPending}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}