import { MetricCard } from "@/components/analytics/MetricCard";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { AnalyticsSettings } from "@/components/analytics/AnalyticsSettings";

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
] as const;

const Analytics = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          Analytics Overview
        </h1>
        <p className="text-muted-foreground">
          Track your farm's performance metrics and trends
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={data} />
        <AnalyticsSettings />
      </div>
    </div>
  );
};

export default Analytics;