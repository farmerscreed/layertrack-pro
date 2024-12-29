import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Egg, TrendingUp } from "lucide-react";

const productionData = [
  { date: "2024-02-01", total: 4500, gradeA: 3800, gradeB: 500, gradeC: 200 },
  { date: "2024-02-02", total: 4600, gradeA: 3900, gradeB: 480, gradeC: 220 },
  { date: "2024-02-03", total: 4550, gradeA: 3850, gradeB: 490, gradeC: 210 },
  { date: "2024-02-04", total: 4700, gradeA: 4000, gradeB: 500, gradeC: 200 },
  { date: "2024-02-05", total: 4650, gradeA: 3950, gradeB: 485, gradeC: 215 },
  { date: "2024-02-06", total: 4800, gradeA: 4100, gradeB: 495, gradeC: 205 },
  { date: "2024-02-07", total: 4750, gradeA: 4050, gradeB: 490, gradeC: 210 },
];

const Production = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Production Tracking</h1>
        <p className="text-muted-foreground">
          Monitor and record daily egg production
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Production</CardTitle>
            <Egg className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,750</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+2.1%</span> vs yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Grade A</CardTitle>
            <Egg className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,050</div>
            <p className="text-xs text-muted-foreground">85.3% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Laying Rate</CardTitle>
            <Egg className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.4%</div>
            <p className="text-xs text-muted-foreground">Current rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <Egg className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">210</div>
            <p className="text-xs text-muted-foreground">4.4% of total</p>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-sm bg-white/50">
        <CardHeader>
          <CardTitle>Production Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="gradeA" 
                  stroke="#0EA5E9" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-white/50">
        <CardHeader>
          <CardTitle>Recent Production Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total Production</TableHead>
                <TableHead>Grade A</TableHead>
                <TableHead>Grade B</TableHead>
                <TableHead>Grade C</TableHead>
                <TableHead>Laying Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productionData.map((record) => (
                <TableRow key={record.date} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono">
                    {new Date(record.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono">{record.total.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{record.gradeA.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{record.gradeB.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{record.gradeC.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">
                    {((record.total / 5000) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Production;