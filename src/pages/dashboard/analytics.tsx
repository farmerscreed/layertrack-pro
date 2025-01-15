import { MetricCard } from "@/components/analytics/MetricCard";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { FarmMetrics } from "@/components/analytics/FarmMetrics";
import { BatchComparison } from "@/components/analytics/BatchComparison";
import { AnalyticsSettings } from "@/components/analytics/AnalyticsSettings";

const Analytics = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          Analytics Overview
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Track your farm's performance metrics and trends
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={0}
          change="0%"
          trend="up"
          isCurrency={true}
        />
        <MetricCard
          title="Active Batches"
          value={0}
          change="0%"
          trend="up"
        />
        <MetricCard
          title="Feed Consumption"
          value={0}
          change="0%"
          trend="down"
          unit="kg"
        />
        <MetricCard
          title="Mortality Rate"
          value={0}
          change="0%"
          trend="down"
          unit="%"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <RevenueChart data={[]} />
        <FarmMetrics />
      </div>

      <div className="grid gap-4 grid-cols-1">
        <BatchComparison />
        <AnalyticsSettings />
      </div>
    </div>
  );
};

export default Analytics;