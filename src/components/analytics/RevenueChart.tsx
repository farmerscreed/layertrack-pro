import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    expenses: number;
  }>;
}

export const RevenueChart = ({ data }: RevenueChartProps) => (
  <Card className="col-span-2 bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Revenue vs Expenses
      </CardTitle>
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
            className="animate-in fade-in duration-1000"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stackId="1"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.2}
            className="animate-in fade-in duration-1000 delay-300"
          />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
);