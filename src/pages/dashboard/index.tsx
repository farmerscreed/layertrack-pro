import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bird,
  Egg,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your farm.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Birds"
          value="5,234"
          trend="+2.5%"
          trendUp={true}
          icon={Bird}
          description="Active birds in all batches"
        />
        <MetricCard
          title="Daily Production"
          value="4,721"
          trend="-1.2%"
          trendUp={false}
          icon={Egg}
          description="Eggs collected today"
        />
        <MetricCard
          title="Feed Stock"
          value="12.5t"
          trend="Low"
          trendUp={false}
          icon={ShoppingCart}
          description="Current feed inventory"
        />
        <MetricCard
          title="Active Alerts"
          value="3"
          trend="New"
          trendUp={false}
          icon={AlertTriangle}
          description="Requires attention"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Production Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Production chart will go here */}
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
              Production Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Activity items will go here */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">Batch #123 Health Check Complete</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <div>
                  <p className="font-medium">Feed Stock Updated</p>
                  <p className="text-sm text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <div>
                  <p className="font-medium">Daily Production Recorded</p>
                  <p className="text-sm text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: any;
  description: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          <span
            className={`flex items-center text-xs ${
              trendUp ? "text-green-500" : "text-red-500"
            }`}
          >
            {trendUp ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;