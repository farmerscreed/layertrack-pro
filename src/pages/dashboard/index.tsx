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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your farm.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Birds</CardTitle>
            <Bird className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,234</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+2.5%</span> vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Production</CardTitle>
            <Egg className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,721</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-500">-1.2%</span> vs yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Feed Stock</CardTitle>
            <ShoppingCart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5t</div>
            <p className="text-xs text-muted-foreground">Current feed inventory</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Production Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border border-white/10 rounded-lg bg-gradient-to-br from-white/5 to-transparent">
              Production Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-colors">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">Batch #123 Health Check Complete</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-secondary/5 to-transparent hover:from-secondary/10 transition-colors">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <div>
                  <p className="font-medium">Feed Stock Updated</p>
                  <p className="text-sm text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-accent/5 to-transparent hover:from-accent/10 transition-colors">
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

export default Dashboard;