import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const data = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 2000, expenses: 9800 },
  { month: "Apr", revenue: 2780, expenses: 3908 },
  { month: "May", revenue: 1890, expenses: 4800 },
  { month: "Jun", revenue: 2390, expenses: 3800 },
  { month: "Jul", revenue: 3490, expenses: 4300 },
];

const metrics = [
  {
    title: "Total Revenue",
    value: "$24,563",
    change: "+12.5%",
    trend: "up",
  },
  {
    title: "Active Batches",
    value: "45",
    change: "+3.2%",
    trend: "up",
  },
  {
    title: "Feed Consumption",
    value: "2,341 kg",
    change: "-0.8%",
    trend: "down",
  },
  {
    title: "Mortality Rate",
    value: "1.2%",
    change: "-0.3%",
    trend: "down",
  },
];

const analyticsFormSchema = z.object({
  reportingPeriod: z.string().min(1, {
    message: "Please select a reporting period.",
  }),
  alertThreshold: z.string().min(1, {
    message: "Please set an alert threshold.",
  }),
});

const Analytics = () => {
  const form = useForm<z.infer<typeof analyticsFormSchema>>({
    resolver: zodResolver(analyticsFormSchema),
    defaultValues: {
      reportingPeriod: "monthly",
      alertThreshold: "10",
    },
  });

  function onSubmit(values: z.infer<typeof analyticsFormSchema>) {
    toast({
      title: "Analytics settings updated",
      description: "Your analytics preferences have been saved.",
    });
    console.log(values);
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Overview</h1>
        <p className="text-muted-foreground">
          Track your farm's performance metrics and trends
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <span
                className={`text-sm ${
                  metric.trend === "up"
                    ? "text-green-600"
                    : "text-destructive"
                }`}
              >
                {metric.change}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px]"
              config={{
                revenue: {
                  label: "Revenue",
                  theme: {
                    light: "#22c55e",
                    dark: "#22c55e",
                  },
                },
                expenses: {
                  label: "Expenses",
                  theme: {
                    light: "#ef4444",
                    dark: "#ef4444",
                  },
                },
              }}
            >
              <AreaChart data={data}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Analytics Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="reportingPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporting Period</FormLabel>
                      <FormControl>
                        <Input placeholder="monthly" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alertThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Threshold (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Update Settings</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;