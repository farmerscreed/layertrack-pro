import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";

interface MetricCardProps {
  title: string;
  value: number;
  change: string;
  trend: "up" | "down";
  isCurrency?: boolean;
  unit?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  isCurrency = false,
  unit
}: MetricCardProps) => {
  const { formatCurrency } = useCurrency();

  const formatValue = () => {
    if (isCurrency) {
      return formatCurrency(value);
    }
    if (unit) {
      return `${value}${unit}`;
    }
    return value;
  };

  return (
    <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          {title}
        </CardTitle>
        <span
          className={`text-sm ${
            trend === "up" ? "text-green-500" : "text-destructive"
          }`}
        >
          {change}
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue()}
        </div>
      </CardContent>
    </Card>
  );
};